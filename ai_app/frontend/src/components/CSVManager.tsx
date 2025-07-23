"use client";

import { useState, useRef } from "react";
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
  DocumentArrowDownIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { exportAppsCSV, importAppsCSV, downloadCSVTemplate } from "@/lib/api";

interface ImportResult {
  success: number;
  errors: string[];
  total: number;
}

export function CSVManager() {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);
  const [showResult, setShowResult] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = async () => {
    try {
      setIsExporting(true);
      const blob = await exportAppsCSV();
      
      // ダウンロード処理
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `ai_apps_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Export failed:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const blob = await downloadCSVTemplate();
      
      // ダウンロード処理
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "ai_apps_template.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Template download failed:", error);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      setImportResult(null);
      setShowResult(false);

      const text = await file.text();
      const result = await importAppsCSV(text);
      
      setImportResult(result);
      setShowResult(true);
    } catch (error) {
      console.error("Import failed:", error);
      setImportResult({
        success: 0,
        errors: ["インポートに失敗しました"],
        total: 0,
      });
      setShowResult(true);
    } finally {
      setIsImporting(false);
      // ファイル選択をリセット
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          CSV管理機能
        </h2>
        <p className="text-sm text-gray-600">
          AIアプリデータをCSVファイルでインポート/エクスポートできます
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* エクスポート */}
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowDownTrayIcon className="w-8 h-8 text-gray-400 mb-2" />
          <span className="font-medium text-gray-900">
            {isExporting ? "エクスポート中..." : "データをエクスポート"}
          </span>
          <span className="text-sm text-gray-500 text-center mt-1">
            全アプリデータをCSVでダウンロード
          </span>
        </button>

        {/* テンプレートダウンロード */}
        <button
          onClick={handleDownloadTemplate}
          className="flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
        >
          <DocumentArrowDownIcon className="w-8 h-8 text-gray-400 mb-2" />
          <span className="font-medium text-gray-900">テンプレート取得</span>
          <span className="text-sm text-gray-500 text-center mt-1">
            インポート用CSVテンプレート
          </span>
        </button>

        {/* インポート */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleImport}
            className="hidden"
          />
          <button
            onClick={triggerFileInput}
            disabled={isImporting}
            className="w-full flex flex-col items-center p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ArrowUpTrayIcon className="w-8 h-8 text-gray-400 mb-2" />
            <span className="font-medium text-gray-900">
              {isImporting ? "インポート中..." : "データをインポート"}
            </span>
            <span className="text-sm text-gray-500 text-center mt-1">
              CSVファイルからアプリを追加
            </span>
          </button>
        </div>
      </div>

      {/* インポート結果表示 */}
      {showResult && importResult && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            インポート結果
          </h3>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {importResult.success}
                </div>
                <div className="text-sm text-gray-600">成功</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-600">
                  {importResult.errors.length}
                </div>
                <div className="text-sm text-gray-600">エラー</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {importResult.total}
                </div>
                <div className="text-sm text-gray-600">合計</div>
              </div>
            </div>
          </div>

          {importResult.success > 0 && (
            <div className="flex items-start space-x-3 mb-4 p-3 bg-green-50 rounded-lg">
              <CheckCircleIcon className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-green-800">
                  インポート成功
                </h4>
                <p className="text-sm text-green-700">
                  {importResult.success}件のアプリが正常にインポートされました。
                </p>
              </div>
            </div>
          )}

          {importResult.errors.length > 0 && (
            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
              <ExclamationTriangleIcon className="w-5 h-5 text-red-500 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-red-800 mb-2">
                  エラー詳細
                </h4>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {importResult.errors.map((error, index) => (
                    <p key={index} className="text-sm text-red-700">
                      • {error}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setShowResult(false)}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* 使用方法 */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-medium text-gray-900 mb-3">使用方法</h3>
        <div className="space-y-3 text-sm text-gray-600">
          <div>
            <span className="font-medium">1. テンプレート取得:</span>
            CSVの形式を確認するため、まずテンプレートをダウンロードしてください。
          </div>
          <div>
            <span className="font-medium">2. データ準備:</span>
            テンプレートを参考に、インポートしたいアプリ情報をCSVファイルで準備してください。
          </div>
          <div>
            <span className="font-medium">3. インポート:</span>
            準備したCSVファイルを選択してインポートを実行してください。
          </div>
          <div>
            <span className="font-medium">4. エクスポート:</span>
            現在のアプリデータをCSVファイルとしてバックアップできます。
          </div>
        </div>
      </div>
    </div>
  );
}