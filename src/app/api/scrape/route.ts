import { NextResponse } from "next/server";
import { generateObject } from "ai";
import { huggingface } from "@ai-sdk/huggingface";
import { z } from "zod";
import * as cheerio from "cheerio";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }


    let htmlContent = "";
    
    try {
      const scraperApiKey = process.env.SCRAPER_API_KEY;
      const fetchUrl = scraperApiKey 
        ? `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(url)}&premium=true&country_code=in` 
        : url;
      
      const res = await fetch(fetchUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        }
      });
      htmlContent = await res.text();
    } catch (err) {
      console.error("Fetch Error:", err);
      return NextResponse.json({ error: "Failed to scrape the website." }, { status: 500 });
    }

    console.log("Scraped HTML length:", htmlContent.length);
    console.log("Snippet:", htmlContent.substring(0, 200));


    const $ = cheerio.load(htmlContent);
    

    let imageUrl = "";
    const imgSelectors = ['#landingImage', '#imgBlkFront', '#ebooksImgBlkFront', '.a-dynamic-image', '#main-image-container img'];
    for (let sel of imgSelectors) {
      const src = $(sel).attr('src');
      if (src && !src.includes('data:image')) {
        imageUrl = src;
        break;
      }
    }

    $('script, style, noscript, iframe, img, svg, video, header, footer, nav').remove();
    const cleanText = $('body').text().replace(/\s+/g, ' ').trim().substring(0, 15000);


    let productData;

    try {
      const { object } = await generateObject({
        model: huggingface('meta-llama/Meta-Llama-3-8B-Instruct'),
        schema: z.object({
          title: z.string().describe("The full name or title of the product"),
          brand: z.string().nullable().describe("The brand or manufacturer. Return null if not found."),
          price: z.number().describe("The current price as a float (e.g. 1499.99). Ignore currency symbols and commas."),
          origin_country: z.string().nullable().describe("The country of origin if explicitly mentioned on the page. Return null if not found."),
          ai_pros_cons: z.object({
            pros: z.array(z.string()).describe("List of 2-3 positive aspects or pros about the product"),
            cons: z.array(z.string()).describe("List of 1-2 negative aspects or cons about the product")
          })
        }),
        prompt: `Extract structured product details from the following raw e-commerce webpage text. If you cannot find a detail (like origin country or brand), do your best to infer it or omit it. For the price, ensure it is a clean number without currency symbols.\n\nRaw Text: \n\n${cleanText}`
      });
      productData = object;
      
    } catch (aiError: any) {
      console.error("Vercel AI SDK Error:", aiError.message);
      throw new Error(`AI Extraction failed: ${aiError.message}`);
    }


    const product = await prisma.product.upsert({
      where: { url },
      update: {
        title: productData.title || "Unknown",
        brand: productData.brand,
        image_url: imageUrl,
        origin_country: productData.origin_country,
        ai_pros_cons: productData.ai_pros_cons as any,
      },
      create: {
        url,
        title: productData.title || "Unknown",
        brand: productData.brand,
        image_url: imageUrl,
        origin_country: productData.origin_country,
        ai_pros_cons: productData.ai_pros_cons as any,
      }
    });

    await prisma.priceHistory.create({
      data: {
        product_id: product.id,
        price: productData.price || 0,
      }
    });

    return NextResponse.json({
      success: true,
      productId: product.id,
    });
  } catch (error: any) {
    console.error("Scraping Pipeline Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
