// src/config/database.ts
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('eigen-backend-test', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

export default sequelize;
