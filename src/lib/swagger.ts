import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Next.js 14 API Docs',
      version: '1.0.0',
    },
  },
  apis: ['./src/app/api/**/*.ts'], // Ajusta si usas .js
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
