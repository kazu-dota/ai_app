import { Router } from 'express';
import { AdminController } from '@/controllers/AdminController';
import { body } from 'express-validator';
import { asyncHandler } from '@/utils/asyncHandler';

const router = Router();
const adminController = new AdminController();

// CSV エクスポート
router.get('/export/csv', asyncHandler(adminController.exportAppsCSV.bind(adminController)));

// CSV インポート
router.post(
  '/import/csv',
  [
    body('csvData')
      .notEmpty()
      .withMessage('CSV data is required')
      .isString()
      .withMessage('CSV data must be a string'),
  ],
  asyncHandler(adminController.importAppsCSV.bind(adminController))
);

// CSV テンプレートダウンロード
router.get('/template/csv', adminController.getAppsTemplate.bind(adminController));

export default router;