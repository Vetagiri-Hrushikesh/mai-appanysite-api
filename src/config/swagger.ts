// config/swagger.ts
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Application } from 'express';
const swaggerOptions = {
    swaggerDefinition: {
      openapi: '3.0.0',
      info: {
        title: 'Your API Title',
        version: '1.0.0',
        description: 'Your API Description',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          xAuthToken: {
            type: 'apiKey',
            in: 'header',
            name: 'x-auth-token',
          },
        },
      },
      security: [
        {
          xAuthToken: [],
        },
      ],
    },
    apis: ['./src/app/modules/auth/*.ts'], // Adjust the path as needed to include all your route files
  };
  
  const swaggerSpecs = swaggerJsdoc(swaggerOptions);
  
  export const setupSwagger = (app: Application): void => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
  };
