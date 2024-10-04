// src/config/swagger.ts
const swaggerJsdoc = require('swagger-jsdoc');

const swaggerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'API documentation for the library system',
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./src/controllers/*.ts', './src/models/*.ts'],
};

module.exports = swaggerJsdoc(swaggerOptions);
