import nodemailer from 'nodemailer';
import 'dotenv/config';

export const sendEmailToUser = async () => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'hotmail',
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    return transporter;
  } catch (error) {
    throw new Error('Error on create email transporter');
  }
}