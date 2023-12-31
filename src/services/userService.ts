import { PrismaClient, Prisma } from '@prisma/client';
import Jwt from 'jsonwebtoken'
import crypto from 'crypto'
import bcrypt from 'bcrypt';
import { FastifyReply, FastifyRequest } from 'fastify';

const prisma = new PrismaClient();

export interface IBodyUser {
  email: string,
  password: string,
}

// Busca usuario por Id no banco
export const getUserById = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  } catch (error) {
    console.error(error);
    throw new Error('Error fetching user');
  }
}

// Busca todos os usuarios do banco
export const getAllUsers = async () => {
  try {
    const allUsers = await prisma.user.findMany();

    if (!allUsers) {
      throw new Error('No useres found');
    }

    return allUsers;
  } catch (error) {
    throw new Error('Error fetching users');
  }
}

// Cria um novo usuario no banco
export const createNewUser = async (username: string, email: string, password: string) => {
  // O prisma cria tipagens para criação de novos objetos, UserCreateInput refere-se ao model de User com todas as suas propriedades
  try {
    let user: Prisma.UserCreateInput;

    // Passando as variaveis que deseja-se adicionar ao novo objeto, pois as demais são automáticas, como o Id e created_at
    user = {
      username: username,
      email: email,
      password: password
    }

    const createdUser = await prisma.user.create({
      data: user
    })

    if (!createdUser) {
      throw new Error('User not created');
    }

    return createdUser;
  } catch (error) {
    console.error(error);
    throw new Error('Error on create user');
  }
}


export async function authenticateUser(userEmail: string, userPassword: string, response: FastifyReply) {
  // Chave secreta para o token
  const secretKey = crypto.randomBytes(32).toString('hex')

  const user = await prisma.user.findUnique({
    where: { email: userEmail },
    select: { id: true, email: true, password: true }
  })

  // Pega a senha enviada pela requisicao, criptografa ela e compara com a senha ja criptografada no banco
  const isPasswordValid = user?.password && await bcrypt.compare(userPassword, user?.password!)

  if (user && isPasswordValid) {
    // Cria um novo token com a secret dele e data de expiracao
    const token = Jwt.sign({ id: user.id }, secretKey, { expiresIn: '24h' });

    return response.send({ message: 'User authenticated', token: token });
  } else {
    return response.status(401).send({ error: 'Invalid credentials' });
  }
}