import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { createCart, getCartById } from "../services/cartService";
import { addProductToCart, deleteAllCartProducts, deleteCartProductById } from "../services/cartProductService";

interface IBodyCart {
  userId: string,
  productIdList: string[],
  cartId: string;
  productId: string;
  quantity: number;
}

async function cartRoutes(fastify: FastifyInstance, options: any) {
  // Busca carrinho pelo Id
  fastify.get('/cart/:id', async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
    try {
      const cartId = request.params.id;
      const cart = await getCartById(cartId);
      response.send(cart);
    } catch (error) {
      console.log(error)
      response.send('Cart not found')
    }
  })

  // Cria um novo carrinho com a lista de produtos do usuario
  fastify.post('/cart', async (request: FastifyRequest<{ Body: IBodyCart }>, response: FastifyReply) => {

    const { userId, productId, quantity } = request.body;
    const cart = await createCart(userId, [])

    if (cart) {
      await addProductToCart(cart.id, productId, quantity);
      response.send(cart);
    }
  })

  fastify.delete('/cart/product/:id', async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
    try {
      const productId = request.params.id;

      await deleteCartProductById(productId);

      response.send('Product deleted successfully');
    } catch (error) {
      console.error(error);
      response.code(404).send('Cart product not found');
    }
  })

  fastify.delete('/cart/product/deleteAll/:id', async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
    try {
      const userId = request.params.id;
      await deleteAllCartProducts(userId);

      response.send('All Products deleted successfully');
    } catch (error) {
      console.error(error);
      response.code(404).send('Error on delete all cart products');
    }
  })
}

export default cartRoutes;