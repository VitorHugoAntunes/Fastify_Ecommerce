import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createNewOrder, getOrderById } from "../services/orderService";

interface IBodyOrder {
  userId: string,
  cartId: string,
  paymentType: string,
  totalAmount: number
}

async function orderRoutes(fastify: FastifyInstance, options: any) {
  fastify.get('/order/:id', async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
    try {
      const orderId = request.params.id;

      const product = await getOrderById(orderId);

      response.send(product);
    } catch (error) {
      console.error(error);
      response.code(500).send('Internal Server Error');
    }
  })

  fastify.post("/order", async (request: FastifyRequest<{ Body: IBodyOrder }>, response: FastifyReply) => {
    try {
      const { userId, cartId, paymentType, totalAmount } = request.body;
      const order = await createNewOrder(userId, cartId, paymentType, totalAmount);
      response.send(order);
    } catch (error) {
      console.error(error);
      response.code(500).send('Internal Server Error');
    }
  })
}

export default orderRoutes;