// config/connection.js
import dotenv from 'dotenv';
dotenv.config({ path: '../.env' }); // adjust path if needed

import { Sequelize } from 'sequelize';

const dbName = process.env.DB_NAME || '';
const dbUser = process.env.DB_USER || '';
const dbPassword = process.env.DB_PASSWORD || '';

const sequelize = process.env.DB_URL
  ? new Sequelize(process.env.DB_URL)
  : new Sequelize(
      dbName,
      dbUser,
      dbPassword,
      {
        host: 'localhost',
        dialect: 'postgres',
        dialectOptions: {
          decimalNumbers: true,
        },
      }
    );

export default sequelize;
