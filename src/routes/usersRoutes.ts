import { FastifyInstance, FastifyRequest, FastifyReply } from "fastify";
import { authenticateUser, createNewUser, getAllUsers, getUserById, IBodyUser, resetUserPassword, sendResetEmailToUser } from "../services/userService";
import { generateHash } from "../utils/hashPassword";

// Interface do corpo da requisicao de usuario
interface IBody {
  username: string,
  email: string,
  password: string,
  passwordConfirmation: string,
}

interface IBodySendResetEmail {
  email: string,
}

interface IBodyResetPassword {
  email: string,
  newPassword: string,
  newPasswordConfirmation: string,
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
      response.send('User not found');
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

    const { username, email, password, passwordConfirmation } = request.body;

    // Funcao para criptografar a senha enviada no corpo da requisicao ao criar usuario
    // Cria uma Promise que pode rejeitar o hash caso de erro, se der certo, criptografa a senha
    // A funcao hash espera como parametro a senha e a quantidade de rounds (quantidade de hashs por segundo)
    if (password === passwordConfirmation) {

      const hashPassword = await generateHash(password);
      const user = await createNewUser(username, email, hashPassword);
      response.send(user);
    } else {
      response.send('Passwords must be equals.')
    }

  });

  // Efetua o login do usuario com autenticacao
  fastify.post('/login', async (request: FastifyRequest<{ Body: IBodyUser }>, response: FastifyReply) => {

    const { email, password } = request.body;

    await authenticateUser(email, password, response);
  });

  fastify.post('/user/sendResetEmail', async (request: FastifyRequest<{ Body: IBodySendResetEmail }>, response: FastifyReply) => {
    const { email } = request.body;

    await sendResetEmailToUser(email);
  })

  fastify.post('/user/resetPassword', async (request: FastifyRequest<{ Body: IBodyResetPassword }>, response: FastifyReply) => {
    const { email, newPassword, newPasswordConfirmation } = request.body;

    if (newPassword === newPasswordConfirmation) {
      const hashPassword = await generateHash(newPassword)

      await resetUserPassword(email, hashPassword)
      response.status(201).send({ message: 'Password updated successfully.' });
    } else {
      response.status(400).send({ error: 'Passwords must be equal.' });
    }
  })
}

export default usersRoutes;