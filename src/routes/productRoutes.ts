import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { getAllProducts, getProductById } from "../services/productService";

async function productRoutes(fastify: FastifyInstance, options: any) {
  // Procura produto por ID
  fastify.get('/product/:id', async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {

    try {
      const productId = request.params.id;

      const product = await getProductById(productId);

      response.send(product);
    } catch (error) {
      console.error(error);
      response.code(500).send('Internal Server Error');
    }

  });

  // Busca todos os produtos do banco
  fastify.get('/products', async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {
    try {
      const allProducts = await getAllProducts();
      response.send(allProducts);
    } catch (error) {
      console.error(error);
      response.code(500).send('Internal Server Error');
    }
  })
}

export default productRoutes;