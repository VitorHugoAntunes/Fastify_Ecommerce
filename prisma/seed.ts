const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const products = [
    {
      title: 'PlayStation 5',
      description: 'Console de última geração da Sony',
      price: 3499.99,
    },
    {
      title: 'Xbox Series X',
      description: 'Console de alta potência da Microsoft',
      price: 3549.99,
    },
    {
      title: 'Nintendo Switch',
      description: 'Console híbrido da Nintendo',
      price: 2299.99,
    },
    {
      title: 'Xbox Series S',
      description: 'Console de alta potência da Microsoft',
      price: 2299.99,
    },
    {
      title: 'Controle Sem Fio Xbox',
      description: 'Controle sem fio para o console Xbox',
      price: 129.99,
    },
    {
      title: 'Jogo The Last of Us Part II',
      description: 'ogo de aventura e ação para PlayStation 5',
      price: 69.99,
    },
    {
      title: 'Headset Gamer HyperX Cloud II',
      description: 'Headset com som surround para uma experiência imersiva',
      price: 149.99,
    },
    {
      title: 'Mouse Gamer Logitech G Pro X',
      description: 'Mouse de alta precisão para jogos',
      price: 79.99,
    }
  ]

  // Create products

  async function seedProducts() {
    for (let i = 0; i < products.length; i++) {
      const product = await prisma.product.create({
        data: {
          title: products[i].title,
          description: products[i].description,
          price: products[i].price,
        },
      });

      console.log(`Product created: ${product.id}`);
    }
  }
  await seedProducts();

  const productData = await prisma.product.findMany();

  const photos = [
    "https://github.com/paulo-cidrao/PWEB-P1/blob/styled-components/public/assets/PS5.jpg?raw=true",
    "https://github.com/paulo-cidrao/PWEB-P1/blob/styled-components/public/assets/Xbox-x.jpg?raw=true",
    "https://github.com/paulo-cidrao/PWEB-P1/blob/styled-components/public/assets/Switch.jpg?raw=true",
    "https://github.com/paulo-cidrao/PWEB-P1/blob/styled-components/public/assets/Xbox-s.jpg?raw=true",
    "https://github.com/paulo-cidrao/PWEB-P1/blob/styled-components/public/assets/Xbox-control.jpg?raw=true",
    "https://github.com/paulo-cidrao/PWEB-P1/blob/styled-components/public/assets/TLOU2.jpg?raw=true",
    "https://github.com/paulo-cidrao/PWEB-P1/blob/styled-components/public/assets/HyperX.jpg?raw=true",
    "https://github.com/paulo-cidrao/PWEB-P1/blob/styled-components/public/assets/Logitech.jpg?raw=true"
  ]

  // Cria as fotos para cada produto - cada um contem 5 fotos
  async function seedPhotos() {
    for (let i = 0; i < productData.length; i++) {
      for (let j = 0; j < 5; j++) {
        const photo = await prisma.photo.create({
          data: {
            product_id: productData[i].id,
            photo_url: photos[i],
          },
        });
        console.log(`Photo created for Product ${productData[i].id}: ${photo.id}`);
      }
    }
  }
  await seedPhotos();

  // Create stock for products
  async function seedStock() {
    for (let i = 0; i < productData.length; i++) {
      const stock = await prisma.stock.create({
        data: {
          product_id: productData[i].id,
          quantity: 100,
        },
      });
      console.log(`Stock created for Product ${productData[i].id}: ${stock.id}`);
    }
  }
  await seedStock();

  console.log('Seed data created successfully!');
}

main()
  .catch((e) => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
