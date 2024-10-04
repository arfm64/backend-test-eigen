// src/app.ts
import express from 'express';
import bodyParser from 'body-parser';
import routes from './routes';
import { sequelize } from './models';


const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./config/swagger');


const app = express();
const PORT = process.env.PORT || 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));


app.use(bodyParser.json());
app.use('/api', routes);

// Fungsi untuk memulai server
export const startServer = () => {
    sequelize.sync()
        .then(() => {
            app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
        })
        .catch((error) => {
            console.error('Unable to connect to the database:', error);
        });
};

// Ekspor app sebagai ekspor default
export default app;
