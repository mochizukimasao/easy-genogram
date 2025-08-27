import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSavePNG: (padding: number, includeBackground: boolean) => void;
  onSaveJSON: () => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, onSavePNG, onSaveJSON }) => {
  const { t } = useLanguage();
  const [padding, setPadding] = useState('40');
  const [includeBackground, setIncludeBackground] = useState(true);

  if (!isOpen) return null;

  const handleSavePNGClick = () => {
    onSavePNG(parseInt(padding, 10) || 0, includeBackground);
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-gray-800 mb-4">保存オプション</h2>
        
        <div className="mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
            <h3 className="text-sm font-medium text-blue-800 mb-2">💡 推奨保存方法</h3>
            <p className="text-sm text-blue-700">
              JSON形式での保存をお勧めします。これにより、後で編集を続けることができ、データの完全性も保たれます。
            </p>
          </div>
        </div>

        <div className="space-y-3 mb-6">
          <button
            onClick={onSaveJSON}
            className="w-full px-4 py-3 text-base font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            💾 JSONで保存（推奨）
          </button>
          <button
            onClick={handleSavePNGClick}
            className="w-full px-4 py-3 text-base font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
          >
            🖼️ PNG画像として保存
          </button>
        </div>

        <div className="border-t border-gray-200 pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">PNG保存オプション</h4>
          
          <div className="mb-4">
            <label htmlFor="padding-input" className="block text-sm font-medium text-gray-700 mb-1">
              余白（ピクセル）
            </label>
            <input
              type="number"
              id="padding-input"
              value={padding}
              onChange={(e) => setPadding(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
              placeholder="例: 40"
              min="0"
              max="200"
            />
          </div>

          <div className="relative flex items-start mb-4">
            <div className="flex items-center h-5">
              <input
                id="include-background"
                name="include-background"
                type="checkbox"
                checked={includeBackground}
                onChange={(e) => setIncludeBackground(e.target.checked)}
                className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="include-background" className="font-medium text-gray-700 cursor-pointer">
                背景を白で塗りつぶす
              </label>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            閉じる
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;