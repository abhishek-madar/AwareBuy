import prisma from '@/lib/prisma';
import ProductClient from './ProductClient';
import Navbar from '@/components/Navbar';

export default async function ProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  // 1. Fetch the exact product from PostgreSQL
  const dbProduct = await prisma.product.findUnique({
    where: { id },
  });

  if (!dbProduct) {
    return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <h1 className="text-2xl font-bold">Product not found in database.</h1>
        </div>
      </div>
    );
  }

  // 2. Fetch all recorded prices for the graph (Corrected Prisma field names)
  const history = await prisma.priceHistory.findMany({
    where: { product_id: id },
    orderBy: { recorded_at: 'asc' }
  });

  // 3. Format the dates so Recharts can display them cleanly on the X-Axis
  let formattedHistory = history.map(entry => ({
    date: new Date(entry.recorded_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' }),
    price: entry.price
  }));

  // 4. Map the database product format to the exact format expected by ProductClient
  const aiData: any = dbProduct.ai_pros_cons || { pros: [], cons: [] };
  const product = {
    ...dbProduct,
    image: dbProduct.image_url,
    pros: Array.isArray(aiData.pros) ? aiData.pros : [],
    cons: Array.isArray(aiData.cons) ? aiData.cons : [],
  };

  // 5. Pass the real data to the interactive client UI
  return (
    <div className="relative min-h-screen bg-[#050505] text-white">
      <Navbar />
      <ProductClient product={product} priceHistory={formattedHistory} />
    </div>
  );
}
