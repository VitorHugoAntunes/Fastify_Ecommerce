import { Prisma, PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

// Busca carrinho pelo Id (cada usuario tem seu carrinho) e filtrando o que deve ser enviado de resposta
export const getCartById = async (cartId: string) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      select: {
        id: true,
        user_id: true,
        user: {
          select: { id: true, username: true }
        },
        products: true,
        Order: true
      }
    })

    return cart;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching cart');
  }
}


export const createCart = async (userId: string, productIds: string[]) => {
  try {
    // Verificar se já existe um carrinho para esse usuário
    const existingCart = await prisma.cart.findUnique({
      where: { user_id: userId }, // Ajuste aqui
      include: { products: true },
    });

    if (existingCart) {
      // Se o carrinho já existe, atualiza com os novos produtos
      const updatedCart = await prisma.cart.update({
        where: { id: existingCart.id },
        data: {
          products: {
            connect: productIds.map(productId => ({ id: productId })),
          },
        },
      });

      return updatedCart;
    } else {
      // Se não houver um carrinho existente, crie um novo
      const newCart = await prisma.cart.create({
        data: {
          user: { connect: { id: userId } },
          products: {
            connect: productIds.map(productId => ({ id: productId })),
          },
        },
      });

      return newCart;
    }
  } catch (error) {
    console.error(error);
    throw new Error('Error on create cart');
  }
}