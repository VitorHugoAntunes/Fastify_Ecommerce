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
    // Check if the product is already in the cart
    const existingCartProduct = await prisma.cartProduct.findUnique({
      where: {
        productId: productId
      },
    });

    if (existingCartProduct) {
      const updatedCartProduct = await prisma.cartProduct.update({
        where: {
          productId: productId,
        },
        data: {
          quantity: existingCartProduct.quantity + quantity,
        },
      });

      return updatedCartProduct;
    } else {
      // If it doesn't exist, create a new cart product
      const newCartProduct = await prisma.cartProduct.create({
        data: {
          cartId,
          productId,
          quantity,
        },
      });

      return newCartProduct;
    }
  } catch (error) {
    console.log(error);
    throw new Error('Error on add product to cart');
  }
};

export const deleteCartProductById = async (productId: string) => {
  try {
    const product = await prisma.cartProduct.delete({
      where: { id: productId },
    });

    if (!product) {
      throw new Error('Product not found');
    }

    return product;
  } catch (error) {
    console.error(error);
    throw new Error('Error on delete product');
  }
}