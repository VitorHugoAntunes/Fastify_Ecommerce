import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Busca produto por Id no banco
export const getProductById = async (productId: string) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        photos: true,
        stock: true,
        _count: true,
      }
    });

    if (!product) {
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
    const allProducts = await prisma.product.findMany(
      {
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          photos: true,
          stock: true
        }
      }
    );

    if (!allProducts) {
      throw new Error('No products found');
    }

    return allProducts;
  } catch (error) {
    throw new Error('Error fetching products');
  }
}