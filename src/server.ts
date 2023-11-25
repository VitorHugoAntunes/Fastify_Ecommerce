import Fastify from "fastify";
import Routes from './routes/index'

// Log das ações do servidor, requisições, etc.
const fastify = Fastify({
    logger: true
})

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