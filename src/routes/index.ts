import { FastifyInstance } from 'fastify';
import usersRoutes from './usersRoutes';
import productRoutes from './productRoutes';
import cartRoutes from './cartRoutes';
import orderRoutes from './orderRoutes';

// register é uma API do fastify para carregar dados no servidor, neste caso carregando as rotas
async function routes(fastify: FastifyInstance, options: any) {
  fastify.register(usersRoutes, { prefix: '/api' });
  fastify.register(productRoutes, { prefix: '/api' });
  fastify.register(cartRoutes, { prefix: '/api' });
  fastify.register(orderRoutes, { prefix: '/api' });
}

export default routes;