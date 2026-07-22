import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Dealership Inventory System API',
      version: '1.0.0',
      description:
        'RESTful API for Car Dealership Inventory Management System with JWT Authentication and Supabase backend.',
      contact: {
        name: 'API Support',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token in the format: Bearer <token>',
        },
      },
      schemas: {
        RegisterRequest: {
          type: 'object',
          required: ['email', 'password', 'name'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              minLength: 8,
              example: 'SecurePass123!',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
          },
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
            },
            password: {
              type: 'string',
              example: 'SecurePass123!',
            },
          },
        },
        PublicUser: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            },
            email: {
              type: 'string',
              format: 'email',
              example: 'john.doe@example.com',
            },
            name: {
              type: 'string',
              example: 'John Doe',
            },
            role: {
              type: 'string',
              enum: ['admin', 'staff'],
              example: 'staff',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-22T12:00:00.000Z',
            },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Registration successful',
            },
            token: {
              type: 'string',
              example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
            },
            user: {
              $ref: '#/components/schemas/PublicUser',
            },
          },
        },
        ApiError: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Invalid input data or authentication error',
            },
          },
        },
        Vehicle: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              example: '550e8400-e29b-41d4-a716-446655440000',
            },
            make: {
              type: 'string',
              example: 'Toyota',
            },
            model: {
              type: 'string',
              example: 'RAV4',
            },
            category: {
              type: 'string',
              example: 'SUV',
            },
            price: {
              type: 'number',
              example: 28500,
            },
            quantity: {
              type: 'integer',
              example: 5,
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-22T12:00:00.000Z',
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              example: '2026-07-22T12:00:00.000Z',
            },
          },
        },
        CreateVehicleRequest: {
          type: 'object',
          required: ['make', 'model', 'category', 'price', 'quantity'],
          properties: {
            make: {
              type: 'string',
              example: 'Toyota',
            },
            model: {
              type: 'string',
              example: 'RAV4',
            },
            category: {
              type: 'string',
              example: 'SUV',
            },
            price: {
              type: 'number',
              example: 28500,
            },
            quantity: {
              type: 'integer',
              example: 5,
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts', './src/routes/**/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
