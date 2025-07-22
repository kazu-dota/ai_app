import { Request, Response } from 'express';
import { AIAppModel } from '@/models/AIAppModel';
import {
  CreateAIAppRequest,
  UpdateAIAppRequest,
  AppListQuery,
  ApiResponse,
  PaginatedResponse,
  AuthUser,
  AppStatus,
} from '@/types';
import { validationResult } from 'express-validator';
import logger from '@/config/logger';

interface AuthenticatedRequest extends Request {
  user?: AuthUser;
}

export class AIAppController {
  private readonly aiAppModel: AIAppModel;

  constructor() {
    this.aiAppModel = new AIAppModel();
  }

  getApps = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
        return;
      }

      const filters: AppListQuery = {
        page: parseInt(req.query.page as string) || 1,
        limit: Math.min(parseInt(req.query.limit as string) || 20, 100),
        sort_by: (req.query.sort_by as string) || 'created_at',
        order: (req.query.order as 'asc' | 'desc') || 'desc',
        q: req.query.q as string,
        category_id: req.query.category_id
          ? parseInt(req.query.category_id as string)
          : undefined,
        status: req.query.status as AppStatus | undefined,
        is_public:
          req.query.is_public !== undefined
            ? req.query.is_public === 'true'
            : undefined,
        creator_id: req.query.creator_id
          ? parseInt(req.query.creator_id as string)
          : undefined,
        tags: req.query.tags
          ? (req.query.tags as string).split(',').map(Number)
          : undefined,
      };

      const userId = req.user?.id;
      const apps = await this.aiAppModel.findAllWithFilters(filters, userId);

      const total = await this.aiAppModel.count();
      const totalPages = Math.ceil(total / (filters.limit ?? 20));

      const response: PaginatedResponse<any> = {
        success: true,
        data: apps,
        pagination: {
          page: filters.page ?? 1,
          limit: filters.limit ?? 20,
          total,
          total_pages: totalPages,
        },
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching apps:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch apps',
      });
    }
  };

  getAppById = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const appId = parseInt(req.params.id!);
      if (isNaN(appId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid app ID',
        });
        return;
      }

      const userId = req.user?.id;
      const app = await this.aiAppModel.findWithDetails(appId, userId);

      if (!app) {
        res.status(404).json({
          success: false,
          error: 'App not found',
        });
        return;
      }

      // Check if user can access private apps
      if (
        !app.is_public &&
        (!req.user ||
          (req.user.id !== app.creator_id && req.user.role !== 'super_admin'))
      ) {
        res.status(403).json({
          success: false,
          error: 'Access denied',
        });
        return;
      }

      // Get additional details
      const [tags, reviews] = await Promise.all([
        this.aiAppModel.getTagsByAppId(appId),
        this.aiAppModel.getReviewsByAppId(appId, 5),
      ]);

      const response: ApiResponse<any> = {
        success: true,
        data: {
          ...app,
          tags,
          reviews,
        },
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching app details:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch app details',
      });
    }
  };

  createApp = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const appData: CreateAIAppRequest = req.body;
      const newApp = await this.aiAppModel.createWithCreator(
        appData,
        req.user.id
      );

      logger.info(`App created: ${newApp.name} by user ${req.user.id}`);

      const response: ApiResponse<any> = {
        success: true,
        data: newApp,
        message: 'App created successfully',
      };

      res.status(201).json(response);
    } catch (error) {
      logger.error('Error creating app:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to create app',
      });
    }
  };

  updateApp = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          error: 'Validation failed',
          details: errors.array(),
        });
        return;
      }

      const appId = parseInt(req.params.id!);
      if (isNaN(appId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid app ID',
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const existingApp = await this.aiAppModel.findById(appId);
      if (!existingApp) {
        res.status(404).json({
          success: false,
          error: 'App not found',
        });
        return;
      }

      // Check permissions
      if (
        req.user.role !== 'super_admin' &&
        (existingApp as any).creator_id !== req.user.id
      ) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
        });
        return;
      }

      const updateData: UpdateAIAppRequest = req.body;
      const updatedApp = await this.aiAppModel.update(appId, updateData);

      logger.info(`App updated: ${appId} by user ${req.user.id}`);

      const response: ApiResponse<any> = {
        success: true,
        data: updatedApp,
        message: 'App updated successfully',
      };

      res.json(response);
    } catch (error) {
      logger.error('Error updating app:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update app',
      });
    }
  };

  deleteApp = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const appId = parseInt(req.params.id!);
      if (isNaN(appId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid app ID',
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const existingApp = await this.aiAppModel.findById(appId);
      if (!existingApp) {
        res.status(404).json({
          success: false,
          error: 'App not found',
        });
        return;
      }

      // Check permissions
      if (
        req.user.role !== 'super_admin' &&
        (existingApp as any).creator_id !== req.user.id
      ) {
        res.status(403).json({
          success: false,
          error: 'Insufficient permissions',
        });
        return;
      }

      const deleted = await this.aiAppModel.delete(appId);

      if (!deleted) {
        res.status(500).json({
          success: false,
          error: 'Failed to delete app',
        });
        return;
      }

      logger.info(`App deleted: ${appId} by user ${req.user.id}`);

      const response: ApiResponse<null> = {
        success: true,
        message: 'App deleted successfully',
      };

      res.json(response);
    } catch (error) {
      logger.error('Error deleting app:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to delete app',
      });
    }
  };

  getPopularApps = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
      const apps = await this.aiAppModel.getPopularApps(limit);

      const response: ApiResponse<any[]> = {
        success: true,
        data: apps,
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching popular apps:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch popular apps',
      });
    }
  };

  getRecentApps = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
      const apps = await this.aiAppModel.getRecentApps(limit);

      const response: ApiResponse<any[]> = {
        success: true,
        data: apps,
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching recent apps:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch recent apps',
      });
    }
  };

  searchApps = async (req: Request, res: Response): Promise<void> => {
    try {
      const searchTerm = req.query.q as string;
      if (!searchTerm || searchTerm.trim().length === 0) {
        res.status(400).json({
          success: false,
          error: 'Search term is required',
        });
        return;
      }

      const limit = Math.min(parseInt(req.query.limit as string) || 20, 100);
      const apps = await this.aiAppModel.searchApps(searchTerm.trim(), limit);

      const response: ApiResponse<any[]> = {
        success: true,
        data: apps,
      };

      res.json(response);
    } catch (error) {
      logger.error('Error searching apps:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to search apps',
      });
    }
  };

  addTagToApp = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const appId = parseInt(req.params.id!);
      const tagId = parseInt(req.params.tagId!);

      if (isNaN(appId) || isNaN(tagId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid app ID or tag ID',
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      const existingApp = await this.aiAppModel.findById(appId);
      if (!existingApp) {
        res.status(404).json({
          success: false,
          error: 'App not found',
        });
        return;
      }

      await this.aiAppModel.addTagToApp(appId, tagId);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Tag added to app successfully',
      };

      res.json(response);
    } catch (error) {
      logger.error('Error adding tag to app:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to add tag to app',
      });
    }
  };

  removeTagFromApp = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const appId = parseInt(req.params.id!);
      const tagId = parseInt(req.params.tagId!);

      if (isNaN(appId) || isNaN(tagId)) {
        res.status(400).json({
          success: false,
          error: 'Invalid app ID or tag ID',
        });
        return;
      }

      if (!req.user) {
        res.status(401).json({
          success: false,
          error: 'Authentication required',
        });
        return;
      }

      await this.aiAppModel.removeTagFromApp(appId, tagId);

      const response: ApiResponse<null> = {
        success: true,
        message: 'Tag removed from app successfully',
      };

      res.json(response);
    } catch (error) {
      logger.error('Error removing tag from app:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to remove tag from app',
      });
    }
  };
}
