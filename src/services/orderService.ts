import { Prisma, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient()

export const getOrderById = async (orderId: string) => {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: orderId
      },
      select: {
        id: true,

        user: {
          select: {
            id: true,
            username: true,
            email: true,
          }
        },
        cart: {
          select: {
            id: true,
            cartProducts: true,
          }
        },

        payment_type: true,
        total_amount: true,
        created_at: true,
        updated_at: true,
      }
    })

    if (!order) {
      throw new Error('Order not found');
    }

    return order;
  } catch (error) {
    console.log(error)
    throw new Error(`Error fetching order`);
  }
}

export const createNewOrder = async (userId: string, cartId: string, paymentType: string, totalAmount: number) => {
  try {
    const newOrder = await prisma.order.create({
      data: {
        user_id: userId,
        cart_id: cartId,
        payment_type: paymentType,
        total_amount: totalAmount,
      },
    });

    const updatedCart = await prisma.cart.update({
      where: { id: cartId },
      data: {
        order_id: newOrder.id,
      },
    });

    return { newOrder, updatedCart };
  } catch (error) {
    console.log(error)
    throw new Error(`Error on create order`);
  }
}