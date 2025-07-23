import { Request, Response } from 'express';
import { AIAppModel } from '@/models/AIAppModel';
import { ApiResponse, RankingItem, RankingType } from '@/types';
import logger from '@/config/logger';

export class RankingController {
  private readonly aiAppModel: AIAppModel;

  constructor() {
    this.aiAppModel = new AIAppModel();
  }

  getRanking = async (req: Request, res: Response): Promise<void> => {
    try {
      const type = req.query.type as RankingType || 'combined';
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);

      let rankingData: RankingItem[] = [];

      switch (type) {
        case 'rating':
          rankingData = await this.aiAppModel.getRankingByRating(limit);
          break;
        case 'usage':
          rankingData = await this.aiAppModel.getRankingByUsage(limit);
          break;
        case 'combined':
          rankingData = await this.aiAppModel.getRankingCombined(limit);
          break;
        case 'monthly':
          rankingData = await this.aiAppModel.getRankingMonthly(limit);
          break;
        case 'weekly':
          rankingData = await this.aiAppModel.getRankingWeekly(limit);
          break;
        default:
          res.status(400).json({
            success: false,
            error: 'Invalid ranking type. Must be one of: rating, usage, combined, monthly, weekly',
          });
          return;
      }

      const response: ApiResponse<RankingItem[]> = {
        success: true,
        data: rankingData,
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching ranking:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch ranking',
      });
    }
  };

  getRankingByRating = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
      const rankingData = await this.aiAppModel.getRankingByRating(limit);

      const response: ApiResponse<RankingItem[]> = {
        success: true,
        data: rankingData,
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching rating ranking:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch rating ranking',
      });
    }
  };

  getRankingByUsage = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
      const rankingData = await this.aiAppModel.getRankingByUsage(limit);

      const response: ApiResponse<RankingItem[]> = {
        success: true,
        data: rankingData,
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching usage ranking:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch usage ranking',
      });
    }
  };

  getRankingCombined = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
      const rankingData = await this.aiAppModel.getRankingCombined(limit);

      const response: ApiResponse<RankingItem[]> = {
        success: true,
        data: rankingData,
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching combined ranking:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch combined ranking',
      });
    }
  };

  getRankingMonthly = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
      const rankingData = await this.aiAppModel.getRankingMonthly(limit);

      const response: ApiResponse<RankingItem[]> = {
        success: true,
        data: rankingData,
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching monthly ranking:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch monthly ranking',
      });
    }
  };

  getRankingWeekly = async (req: Request, res: Response): Promise<void> => {
    try {
      const limit = Math.min(parseInt(req.query.limit as string) || 10, 50);
      const rankingData = await this.aiAppModel.getRankingWeekly(limit);

      const response: ApiResponse<RankingItem[]> = {
        success: true,
        data: rankingData,
      };

      res.json(response);
    } catch (error) {
      logger.error('Error fetching weekly ranking:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to fetch weekly ranking',
      });
    }
  };

  updateRankings = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.aiAppModel.updateRankings();
      
      const response: ApiResponse<null> = {
        success: true,
        message: 'Rankings updated successfully',
      };

      res.json(response);
    } catch (error) {
      logger.error('Error updating rankings:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to update rankings',
      });
    }
  };
}