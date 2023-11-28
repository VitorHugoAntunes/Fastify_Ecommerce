import bcrypt from 'bcrypt';

export async function generateHash(password: string) {
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