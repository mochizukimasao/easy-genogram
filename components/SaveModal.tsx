import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface SaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveSVG: (padding: number, includeBackground: boolean) => void;
  onSavePNG: (padding: number, includeBackground: boolean) => void;
  onSaveJSON: () => void;
}

const SaveModal: React.FC<SaveModalProps> = ({ isOpen, onClose, onSaveSVG, onSavePNG, onSaveJSON }) => {
  const { t } = useLanguage();
  const [padding, setPadding] = useState('40');
  const [includeBackground, setIncludeBackground] = useState(true);

  if (!isOpen) return null;

  const handleSaveSVGClick = () => {
    onSaveSVG(parseInt(padding, 10) || 0, includeBackground);
  };
  
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
        <h2 className="text-xl font-bold text-gray-800 mb-4">{t('saveOptions')}</h2>
        
        <div className="mb-4">
            <label htmlFor="padding-input" className="block text-sm font-medium text-gray-700 mb-1">
                {t('paddingPx')}
            </label>
            <input
                type="number"
                id="padding-input"
                value={padding}
                onChange={(e) => setPadding(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                placeholder="e.g., 40"
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
                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                />
            </div>
            <div className="ml-3 text-sm">
                <label htmlFor="include-background" className="font-medium text-gray-700 cursor-pointer">
                    {t('includeBackground')}
                </label>
            </div>
        </div>

        <div className="space-y-3">
            <button
                onClick={onSaveJSON}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
                JSONで保存（推奨）
            </button>
            <button
                onClick={handleSaveSVGClick}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {t('saveAsSVG')}
            </button>
            <button
                onClick={handleSavePNGClick}
                className="w-full px-4 py-2 text-sm font-medium text-white bg-teal-600 border border-transparent rounded-md shadow-sm hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500"
            >
                {t('saveAsPNG')}
            </button>
        </div>

        <div className="mt-6 flex justify-end">
            <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
                {t('cancel')}
            </button>
        </div>
      </div>
    </div>
  );
};

export default SaveModal;