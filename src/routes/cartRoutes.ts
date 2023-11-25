import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createCart, getCartById } from "../services/cartService";

interface IBodyCart {
  userId: string,
  productIdList: string[],
}

async function cartRoutes(fastify: FastifyInstance, options: any) {
  // Busca carrinho pelo Id
  fastify.get('/cart/:id', async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
    const cartId = request.params.id;
    const cart = await getCartById(cartId);
    response.send(cart);
  })

  // Cria um novo carrinho com a lista de produtos do usuario
  fastify.post('/cart', async (request: FastifyRequest<{ Body: IBodyCart }>, response: FastifyReply) => {

    const { userId, productIdList } = request.body;
    const cart = await createCart(userId, productIdList)
    response.send(cart);
  })
}

export default cartRoutes;