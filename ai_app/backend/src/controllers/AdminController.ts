import { Request, Response } from 'express';
import { AIAppModel } from '@/models/AIAppModel';
import { ApiResponse, CreateAIAppRequest } from '@/types';
import logger from '@/config/logger';

export class AdminController {
  private readonly aiAppModel: AIAppModel;

  constructor() {
    this.aiAppModel = new AIAppModel();
  }

  exportAppsCSV = async (req: Request, res: Response): Promise<void> => {
    try {
      // すべてのアプリを取得
      const apps = await this.aiAppModel.findAllWithFilters({}, undefined);

      // CSVヘッダー
      const csvHeader = [
        'ID',
        'アプリ名',
        '説明',
        'カテゴリID',
        '作成者ID',
        'ステータス',
        'URL',
        'API エンドポイント',
        '技術スタック',
        '利用方法',
        '入力例',
        '出力例',
        'モデル情報',
        '動作環境',
        '利用回数',
        '平均評価',
        '公開フラグ',
        '作成日',
        '更新日'
      ].join(',');

      // CSVデータ
      const csvData = apps.map(app => [
        app.id,
        `"${app.name.replace(/"/g, '""')}"`,
        `"${app.description.replace(/"/g, '""')}"`,
        app.category_id,
        app.creator_id,
        app.status,
        `"${app.url ?? ''}"`,
        `"${app.api_endpoint ?? ''}"`,
        `"${JSON.stringify(app.tech_stack ?? {}).replace(/"/g, '""')}"`,
        `"${(app.usage_guide ?? '').replace(/"/g, '""')}"`,
        `"${(app.input_example ?? '').replace(/"/g, '""')}"`,
        `"${(app.output_example ?? '').replace(/"/g, '""')}"`,
        `"${app.model_info ?? ''}"`,
        `"${app.environment ?? ''}"`,
        app.usage_count,
        app.avg_rating ?? '',
        app.is_public ? 'TRUE' : 'FALSE',
        app.created_at,
        app.updated_at
      ].join(',')).join('\n');

      const csvContent = csvHeader + '\n' + csvData;

      // CSVファイルとしてレスポンス
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="ai_apps.csv"');
      res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8'));
      
      // UTF-8 BOMを追加（Excelでの文字化け防止）
      res.write('\ufeff');
      res.write(csvContent, 'utf8');
      res.end();

      logger.info('Apps exported to CSV successfully');
    } catch (error) {
      logger.error('Error exporting apps to CSV:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to export apps to CSV',
      });
    }
  };

  importAppsCSV = async (req: Request, res: Response): Promise<void> => {
    try {
      const csvData = (req.body as { csvData: string }).csvData;
      
      if (!csvData) {
        res.status(400).json({
          success: false,
          error: 'CSV data is required',
        });
        return;
      }

      // CSVを解析
      const lines = csvData.split('\n');
      
      const results = {
        success: 0,
        errors: [] as string[],
        total: lines.length - 1
      };

      // ヘッダー行をスキップしてデータを処理
      for (let i = 1; i < lines.length; i++) {
        const currentLine = lines[i];
        if (!currentLine) continue;
        const line = currentLine.trim();
        if (!line) continue;

        try {
          const values = this.parseCSVLine(line);
          
          if (values.length < 6) {
            results.errors.push(`行 ${i + 1}: 必須フィールドが不足しています`);
            continue;
          }

          const appData: CreateAIAppRequest = {
            name: values[1] ?? '',
            description: values[2] ?? '',
            category_id: parseInt(values[3] ?? '1') || 1,
            status: (values[5] as 'development' | 'testing' | 'active' | 'maintenance' | 'deprecated' | 'archived') ?? 'development',
            url: values[6] ?? '',
            api_endpoint: values[7] ?? '',
            tech_stack: values[8] ? JSON.parse(values[8]) as Record<string, unknown> : {},
            usage_guide: values[9] ?? '',
            input_example: values[10] ?? '',
            output_example: values[11] ?? '',
            model_info: values[12] ?? '',
            environment: values[13] ?? '',
            is_public: values[17]?.toLowerCase() === 'true'
          };

          // アプリを作成（作成者IDは1をデフォルトに設定）
          const creatorId = parseInt(values[4] ?? '1') || 1;
          await this.aiAppModel.createWithCreator(appData, creatorId);
          results.success++;

        } catch (error) {
          results.errors.push(`行 ${i + 1}: ${error instanceof Error ? error.message : 'データ処理エラー'}`);
        }
      }

      const response: ApiResponse<typeof results> = {
        success: true,
        data: results,
        message: `${results.success}件のアプリをインポートしました`,
      };

      res.json(response);
      logger.info(`CSV import completed: ${results.success} success, ${results.errors.length} errors`);

    } catch (error) {
      logger.error('Error importing apps from CSV:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to import apps from CSV',
      });
    }
  };

  getAppsTemplate = (req: Request, res: Response): void => {
    try {
      // CSVテンプレート
      const csvTemplate = [
        'ID,アプリ名,説明,カテゴリID,作成者ID,ステータス,URL,API エンドポイント,技術スタック,利用方法,入力例,出力例,モデル情報,動作環境,利用回数,平均評価,公開フラグ,作成日,更新日',
        ',サンプルアプリ,これはサンプルアプリです,1,1,development,https://example.com,https://api.example.com,"{""framework"": ""React""}",このアプリの使用方法,入力例はこちら,出力例はこちら,GPT-4,Web,0,,TRUE,,'
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="ai_apps_template.csv"');
      res.setHeader('Content-Length', Buffer.byteLength(csvTemplate, 'utf8'));
      
      // UTF-8 BOMを追加
      res.write('\ufeff');
      res.write(csvTemplate, 'utf8');
      res.end();

      logger.info('CSV template downloaded');
    } catch (error) {
      logger.error('Error generating CSV template:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to generate CSV template',
      });
    }
  };

  // CSV行を解析するヘルパーメソッド
  private parseCSVLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        if (inQuotes && line[i + 1] === '"') {
          // エスケープされた引用符
          current += '"';
          i++; // 次の文字をスキップ
        } else {
          // 引用符の開始/終了
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // フィールドの区切り
        result.push(current);
        current = '';
      } else {
        current += char;
      }
    }
    
    // 最後のフィールドを追加
    result.push(current);
    
    return result;
  }
}