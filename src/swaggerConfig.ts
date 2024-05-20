import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';

const options: swaggerJSDoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Train API',
            version: '1.0.0',
            description: 'This is a sample server for a train API'
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT'
                }
            }
        },
        security: [{
            bearerAuth: []
        }],
        servers: [
            {
                url: 'http://localhost:3000/api'
            }
        ],
        basePath: '/api'
    },
    apis: ['./config/*.yaml']  // Ensure this path is correct in the context of the new file location
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app: Application): void => {
    app.use('/swag', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
