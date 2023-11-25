import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { authenticateUser, createNewUser, getAllUsers, getUserById, IBodyUser } from "../services/userService";
import bcrypt from 'bcrypt';

// Interface do corpo da requisicao de usuario
interface IBody {
  username: string,
  email: string,
  password: string,
}

async function usersRoutes(fastify: FastifyInstance, options: any) {
  // Busca o usuario pelo Id
  fastify.get('/user/:id', async (request: FastifyRequest<{ Params: { id: string } }>, response: FastifyReply) => {

    try {
      const userId = request.params.id;

      const user = await getUserById(userId);

      response.send(user);
    } catch (error) {
      console.error(error);
      response.code(500).send('Internal Server Error');
    }
  });

  // Busca todos os usuarios
  fastify.get('/users', async (request: FastifyRequest, response: FastifyReply) => {
    try {
      const allUsers = await getAllUsers();
      response.send(allUsers);
    } catch (error) {
      console.error(error);
      response.code(500).send('Internal Server Error');
    }
  })

  // Cria um novo usuario com os dados enviados pelo corpo da requisicao
  // Por padrão, o fastify não sabe o formato dos dados que esperamos no body, então podemos criar uma tipagem com os dados que desejamos
  // Criando com generics e passando a tipagem para Body
  fastify.post('/user', async (request: FastifyRequest<{ Body: IBody }>, response: FastifyReply) => {

    const { username, email, password } = request.body;
    console.log('SENHA DO USUARIO PARA CRIAR: ', password)

    // Funcao para criptografar a senha enviada no corpo da requisicao ao criar usuario
    // Cria uma Promise que pode rejeitar o hash caso de erro, se der certo, criptografa a senha
    // A funcao hash espera como parametro a senha e a quantidade de rounds (quantidade de hashs por segundo)
    async function generateHash(password: string) {
      const hash = await new Promise<string>((resolve, reject) => {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      });
      return hash;
    }

    const hashPassword = await generateHash(password)

    const user = await createNewUser(username, email, hashPassword);
    response.send(user);
  });

  // Efetua o login do usuario
  fastify.post('/login', async (request: FastifyRequest<{ Body: IBodyUser }>, response: FastifyReply) => {

    const { email, password } = request.body;

    await authenticateUser(email, password, response);
  });
}

export default usersRoutes;