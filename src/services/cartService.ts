import { Prisma, PrismaClient, Product } from '@prisma/client';

const prisma = new PrismaClient();

// Busca carrinho pelo Id (cada usuario tem seu carrinho) e filtrando o que deve ser enviado de resposta
export const getCartById = async (cartId: string) => {
  try {
    const cart = await prisma.cart.findUnique({
      where: { id: cartId },
      select: {
        id: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        cartProducts: {
          select: {
            id: true,
            product: true,
            quantity: true,
          }
        },
        order: true
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
      where: { user_id: userId },
      include: { cartProducts: true },
    });

    if (existingCart) {
      // Se o carrinho já existe, atualiza com os novos produtos
      const updatedCart = await prisma.cart.update({
        where: { id: existingCart.id },
        data: {
          cartProducts: {
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
          cartProducts: {
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