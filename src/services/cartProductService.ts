import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Busca todos os produtos do banco
export const getAllCartProducts = async () => {
  try {
    const allCartProducts = await prisma.cartProduct.findMany();

    if (!allCartProducts) {
      throw new Error('No products found');
    }

    return allCartProducts;
  } catch (error) {
    throw new Error('Error fetching products');
  }
}

export const addProductToCart = async (cartId: string, productId: string, quantity: number) => {

  try {
    const cartProduct = await prisma.cartProduct.create({
      data: {
        cartId: cartId,
        productId: productId,
        quantity: quantity
      }
    })

    return cartProduct
  } catch (error) {
    console.log(error);
    throw new Error('Error on create cart product');
  }
}