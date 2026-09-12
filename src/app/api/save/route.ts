import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const product = await prisma.product.upsert({
      where: { url: data.url },
      update: {
        title: data.title,
        image_url: data.image,
      },
      create: {
        url: data.url,
        title: data.title,
        brand: data.brand || 'Amazon',
        image_url: data.image,
        ai_pros_cons: {
          pros: ['Extracted directly from browser', 'Zero API latency', 'Bypassed Amazon Captcha'],
          cons: ['Manual trigger required']
        },
      }
    });

    await prisma.priceHistory.create({
      data: {
        product_id: product.id,
        price: data.price,
      }
    });

    return NextResponse.json({ success: true, id: product.id });
  } catch (error: any) {
    console.error("Save Error:", error);
    return NextResponse.json({ error: error.message || "Failed to save data" }, { status: 500 });
  }
}
