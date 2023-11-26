import Fastify from "fastify";
import Routes from './routes/index'
import cors from '@fastify/cors';

// Log das ações do servidor, requisições, etc.
const fastify = Fastify({
    logger: true
})

fastify.register(cors, {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: ["Content-Type", "Authorization"]
});


const port = 3000;

// Carregando todas as rotas
fastify.register(Routes)

const startServer = async () => {
    try {
        await fastify.listen({ port: port })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }

    console.log(`Server running on port: ${port}`)
}

startServer()