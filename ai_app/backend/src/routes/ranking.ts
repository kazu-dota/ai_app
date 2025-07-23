import { Router } from 'express';
import { RankingController } from '@/controllers/RankingController';
import { query } from 'express-validator';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();
const rankingController = new RankingController();

// 汎用ランキングエンドポイント
router.get(
  '/',
  [
    query('type')
      .optional()
      .isIn(['rating', 'usage', 'combined', 'monthly', 'weekly'])
      .withMessage('Type must be one of: rating, usage, combined, monthly, weekly'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
  ],
  asyncHandler(rankingController.getRanking.bind(rankingController))
);

// 評価ランキング
router.get(
  '/rating',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
  ],
  asyncHandler(rankingController.getRankingByRating.bind(rankingController))
);

// アクセスランキング
router.get(
  '/usage',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
  ],
  asyncHandler(rankingController.getRankingByUsage.bind(rankingController))
);

// 複合ランキング
router.get(
  '/combined',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
  ],
  asyncHandler(rankingController.getRankingCombined.bind(rankingController))
);

// 月間ランキング
router.get(
  '/monthly',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
  ],
  asyncHandler(rankingController.getRankingMonthly.bind(rankingController))
);

// 週間ランキング
router.get(
  '/weekly',
  [
    query('limit')
      .optional()
      .isInt({ min: 1, max: 50 })
      .withMessage('Limit must be between 1 and 50'),
  ],
  asyncHandler(rankingController.getRankingWeekly.bind(rankingController))
);

// ランキング更新（管理者向け）
router.post('/update', asyncHandler(rankingController.updateRankings.bind(rankingController)));

export default router;