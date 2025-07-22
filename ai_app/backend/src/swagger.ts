import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'AI App Catalog API',
      version: '1.0.0',
      description: 'API for managing internal AI application catalog',
    },
    servers: [
      {
        url: 'http://localhost:3001/api',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            email: { type: 'string' },
            avatar_url: { type: 'string', nullable: true },
            role: { 
              type: 'string',
              enum: ['admin', 'creator', 'user']
            },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        Category: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string', nullable: true },
            color: { type: 'string', nullable: true },
            type: {
              type: 'string',
              enum: ['business', 'target', 'difficulty']
            },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Tag: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            color: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        AIApp: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            description: { type: 'string' },
            category_id: { type: 'number', nullable: true },
            status: {
              type: 'string',
              enum: ['active', 'development', 'testing', 'maintenance', 'deprecated', 'archived']
            },
            url: { type: 'string', nullable: true },
            api_endpoint: { type: 'string', nullable: true },
            model_info: { type: 'string', nullable: true },
            environment: { type: 'string', nullable: true },
            usage_guide: { type: 'string', nullable: true },
            input_example: { type: 'string', nullable: true },
            output_example: { type: 'string', nullable: true },
            tech_stack: { type: 'object' },
            is_public: { type: 'boolean' },
            creator_id: { type: 'number', nullable: true },
            usage_count: { type: 'number' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        AIAppWithDetails: {
          allOf: [
            { $ref: '#/components/schemas/AIApp' },
            {
              type: 'object',
              properties: {
                creator: { $ref: '#/components/schemas/User' },
                category: { $ref: '#/components/schemas/Category' },
                tags: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/Tag' }
                },
                reviews: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/ReviewWithUser' }
                },
                avg_rating: { type: 'number', nullable: true },
                favorites_count: { type: 'number' },
                is_favorited: { type: 'boolean' },
              },
            },
          ],
        },
        Review: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            app_id: { type: 'number' },
            user_id: { type: 'number' },
            rating: { type: 'number', minimum: 1, maximum: 5 },
            comment: { type: 'string', nullable: true },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
        ReviewWithUser: {
          allOf: [
            { $ref: '#/components/schemas/Review' },
            {
              type: 'object',
              properties: {
                user: { $ref: '#/components/schemas/User' },
              },
            },
          ],
        },
        UsageLog: {
          type: 'object',
          properties: {
            id: { type: 'number' },
            app_id: { type: 'number' },
            user_id: { type: 'number', nullable: true },
            action_type: {
              type: 'string',
              enum: ['view', 'use', 'favorite', 'review']
            },
            metadata: { type: 'object' },
            created_at: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string' },
            message: { type: 'string' },
          },
        },
        PaginatedApps: {
          type: 'object',
          properties: {
            apps: {
              type: 'array',
              items: { $ref: '#/components/schemas/AIAppWithDetails' }
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number' },
                limit: { type: 'number' },
                total: { type: 'number' },
                totalPages: { type: 'number' },
              },
            },
          },
        },
      },
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJSDoc(options);

export const setupSwagger = (app: Express): void => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .scheme-container { background: #fafafa; padding: 20px; margin: 20px 0; }
    `,
    customSiteTitle: 'AI App Catalog API Documentation',
  }));

  // Serve the JSON spec
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};

export default specs;