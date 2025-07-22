import { Router, Request, Response, NextFunction } from 'express';
import { body, query, param } from 'express-validator';
import { AIAppController } from '@/controllers/AIAppController';
import { authenticateToken, optionalAuth } from '@/middleware/auth';
import { requireRole } from '@/middleware/roleAuth';
import { rateLimiter } from '@/middleware/rateLimiter';

// Async handler wrapper for Express routes
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

/**
 * @swagger
 * tags:
 *   - name: Apps
 *     description: AI Application management endpoints
 *   - name: Reviews
 *     description: Application review and rating endpoints
 *   - name: Favorites
 *     description: User favorites management endpoints
 *   - name: Usage
 *     description: Usage tracking endpoints
 */

const router = Router();
const aiAppController = new AIAppController();

// Validation rules
const createAppValidation = [
  body('name')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters'),
  body('description')
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Description must be between 1 and 5000 characters'),
  body('category_id')
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  body('status')
    .optional()
    .isIn([
      'development',
      'testing',
      'active',
      'maintenance',
      'deprecated',
      'archived',
    ])
    .withMessage('Invalid status value'),
  body('url').optional().isURL().withMessage('URL must be a valid URL'),
  body('api_endpoint')
    .optional()
    .isURL()
    .withMessage('API endpoint must be a valid URL'),
  body('tech_stack')
    .optional()
    .isObject()
    .withMessage('Tech stack must be a valid JSON object'),
  body('usage_guide')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('Usage guide must not exceed 10000 characters'),
  body('model_info')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Model info must not exceed 200 characters'),
  body('is_public')
    .optional()
    .isBoolean()
    .withMessage('is_public must be a boolean'),
];

const updateAppValidation = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Name must be between 1 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 1, max: 5000 })
    .withMessage('Description must be between 1 and 5000 characters'),
  body('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  body('status')
    .optional()
    .isIn([
      'development',
      'testing',
      'active',
      'maintenance',
      'deprecated',
      'archived',
    ])
    .withMessage('Invalid status value'),
  body('url').optional().isURL().withMessage('URL must be a valid URL'),
  body('api_endpoint')
    .optional()
    .isURL()
    .withMessage('API endpoint must be a valid URL'),
  body('tech_stack')
    .optional()
    .isObject()
    .withMessage('Tech stack must be a valid JSON object'),
  body('usage_guide')
    .optional()
    .trim()
    .isLength({ max: 10000 })
    .withMessage('Usage guide must not exceed 10000 characters'),
  body('model_info')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Model info must not exceed 200 characters'),
  body('is_public')
    .optional()
    .isBoolean()
    .withMessage('is_public must be a boolean'),
];

const listAppsValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort_by')
    .optional()
    .isIn(['name', 'created_at', 'updated_at', 'usage_count', 'avg_rating'])
    .withMessage('Invalid sort field'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc'),
  query('category_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Category ID must be a positive integer'),
  query('status')
    .optional()
    .isIn([
      'development',
      'testing',
      'active',
      'maintenance',
      'deprecated',
      'archived',
    ])
    .withMessage('Invalid status value'),
  query('is_public')
    .optional()
    .isBoolean()
    .withMessage('is_public must be a boolean'),
  query('creator_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Creator ID must be a positive integer'),
  query('q')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Search query must be between 1 and 200 characters'),
];

const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];

const tagIdParamValidation = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('App ID must be a positive integer'),
  param('tagId')
    .isInt({ min: 1 })
    .withMessage('Tag ID must be a positive integer'),
];

// Public routes (no authentication required)

/**
 * @swagger
 * /popular:
 *   get:
 *     tags: [Apps]
 *     summary: Get popular AI applications
 *     description: Retrieve a list of popular AI applications based on usage count
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 50
 *           default: 10
 *         description: Maximum number of apps to return
 *     responses:
 *       200:
 *         description: List of popular applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/AIAppWithDetails'
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/popular',
  rateLimiter,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  asyncHandler(aiAppController.getPopularApps.bind(aiAppController))
);

router.get(
  '/recent',
  rateLimiter,
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  asyncHandler(aiAppController.getRecentApps.bind(aiAppController))
);

router.get(
  '/search',
  rateLimiter,
  query('q').notEmpty().withMessage('Search query is required'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  asyncHandler(aiAppController.searchApps.bind(aiAppController))
);

// Routes with optional authentication (enhances user experience)

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Apps]
 *     summary: List AI applications with filtering and pagination
 *     description: Get a paginated list of AI applications with optional filtering by categories, status, tags, etc.
 *     security:
 *       - BearerAuth: []
 *       - {}
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 20
 *         description: Number of items per page
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [name, created_at, updated_at, usage_count, avg_rating]
 *           default: created_at
 *         description: Field to sort by
 *       - in: query
 *         name: order
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *         description: Sort order
 *       - in: query
 *         name: categories
 *         schema:
 *           type: string
 *         description: Comma-separated list of category IDs to filter by
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Comma-separated list of status values to filter by
 *       - in: query
 *         name: tags
 *         schema:
 *           type: string
 *         description: Comma-separated list of tag IDs to filter by
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *           maxLength: 200
 *         description: Search query for app name and description
 *     responses:
 *       200:
 *         description: Paginated list of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/PaginatedApps'
 *       400:
 *         description: Invalid request parameters
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/',
  optionalAuth,
  rateLimiter,
  listAppsValidation,
  asyncHandler(aiAppController.getApps.bind(aiAppController))
);

/**
 * @swagger
 * /{id}:
 *   get:
 *     tags: [Apps]
 *     summary: Get AI application by ID
 *     description: Retrieve detailed information about a specific AI application
 *     security:
 *       - BearerAuth: []
 *       - {}
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/AIAppWithDetails'
 *       404:
 *         description: Application not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/:id',
  optionalAuth,
  rateLimiter,
  idParamValidation,
  asyncHandler(aiAppController.getAppById.bind(aiAppController))
);

// Protected routes (authentication required)
router.post(
  '/',
  authenticateToken,
  requireRole(['user', 'admin', 'super_admin']),
  rateLimiter,
  createAppValidation,
  asyncHandler(aiAppController.createApp.bind(aiAppController))
);

router.put(
  '/:id',
  authenticateToken,
  requireRole(['user', 'admin', 'super_admin']),
  rateLimiter,
  idParamValidation,
  updateAppValidation,
  asyncHandler(aiAppController.updateApp.bind(aiAppController))
);

router.delete(
  '/:id',
  authenticateToken,
  requireRole(['user', 'admin', 'super_admin']),
  rateLimiter,
  idParamValidation,
  asyncHandler(aiAppController.deleteApp.bind(aiAppController))
);

// Tag management (admin+ required)
router.post(
  '/:id/tags/:tagId',
  authenticateToken,
  requireRole(['admin', 'super_admin']),
  rateLimiter,
  tagIdParamValidation,
  asyncHandler(aiAppController.addTagToApp.bind(aiAppController))
);

router.delete(
  '/:id/tags/:tagId',
  authenticateToken,
  requireRole(['admin', 'super_admin']),
  rateLimiter,
  tagIdParamValidation,
  asyncHandler(aiAppController.removeTagFromApp.bind(aiAppController))
);

export default router;
