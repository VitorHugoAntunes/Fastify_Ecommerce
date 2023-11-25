import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Busca produto por Id no banco
export const getProductById = async (productId: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      console.log('ID DO PRODUTO:', productId)
      throw new Error('Product not found');
    }

    return product;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching product');
  }
};

// Busca todos os produtos do banco
export const getAllProducts = async () => {
  try {
    const allProducts = await prisma.product.findMany();

    if(!allProducts) {
      throw new Error('No products found');
    }

    return allProducts;
  } catch (error) {
    throw new Error('Error fetching products');
  }
}