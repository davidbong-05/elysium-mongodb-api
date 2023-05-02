# Elysium

The project is the backend to a NFT marketplace that is built on the Ethereum blockchain. It is my final year project for my Bachelor of Computer Science (Software Engineering) with Honour at the Universiti Malaysia Sarawak.

## Project Description

Front End:

- [elysium](https://github.com/davidbong-05/elysium.git)

Back End:

- [elysium-mongodb-api](https://github.com/davidbong-05/elysium-mongodb-api.git)
- [elysium-smart-contract](https://github.com/davidbong-05/elysium-smart-contract.git)
- [MongoDB](https://www.mongodb.com/)
- [Pinata](https://pinata.cloud/)

The project is built using the following technologies:

- [Solidity](https://docs.soliditylang.org/en/v0.8.4/)
- [Vite](https://vitejs.dev/)
- [Vue 3](https://v3.vuejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Node.js](https://nodejs.org/en/)
- [ethers.js](https://docs.ethers.io/v6/)

## Project Setup

Step 1: Clone the repository

```bash
git clone https://github.com/davidbong-05/elysium-mongodb-api.git
```

Step 2: Install dependencies

```bash
npm install
```

Step 3: Rename the .env.example file to .env and fill in the required information

```bash
# .env.example
NODE_ENV = development
PORT = 8080

# Refer to the MongoDB Atlas documentation on how to get the URI
MONGO_URI = <MONGODB URI>
MONGO_USER = <MONGODB username>
MONGO_KEY = <MONGODB password>
```

Step 4: Run the project

```bash
npm run serve
```

Step 5: The front end should be able to connect using the this url:

```bash
http://localhost:8080/
```

This project requires the following to be setup as well:

- [elysium](https://github.com/davidbong-05/elysium.git)

Attention: The project is still under development and is not ready for production.

## Contact

email: davidbong05@gmail.com
