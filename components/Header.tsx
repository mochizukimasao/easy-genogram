import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { UndoIcon } from './icons/UndoIcon';
import { RedoIcon } from './icons/RedoIcon';

interface HeaderProps {
  onSave: () => void;
  onLoad: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isGridVisible: boolean;
  onGridToggle: (visible: boolean) => void;
}

const Button: React.FC<{onClick: () => void, children: React.ReactNode, className?: string, disabled?: boolean, title?: string}> = ({ onClick, children, className = '', disabled=false, title }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 whitespace-nowrap transition-all duration-200 shadow-sm hover:shadow-md ${className}`}
        disabled={disabled}
        title={title}
    >
        {children}
    </button>
);

const IconButton: React.FC<{onClick: () => void, children: React.ReactNode, disabled?: boolean, title: string, active?: boolean}> = ({ onClick, children, disabled=false, title, active = false }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={title}
        className={`p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ${
            active 
            ? 'bg-blue-50 text-blue-600 border-blue-300 shadow-sm' 
            : 'bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md'
        }`}
    >
        {children}
    </button>
)


const Header: React.FC<HeaderProps> = ({ onSave, onLoad, onUndo, onRedo, canUndo, canRedo, isGridVisible, onGridToggle }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 shadow-lg z-20 w-full">
      <div className="max-w-full mx-auto px-4 overflow-x-auto">
        <div className="flex justify-between items-center h-16 flex-nowrap">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-gray-800 whitespace-nowrap">{t('header')}</h1>
            <a 
              href="/manual.html" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:text-blue-800 hover:underline font-medium"
            >
              📖 マニュアル
            </a>
          </div>
          <div className="flex items-center gap-3 flex-nowrap">
            <Button onClick={onSave}>{t('save')}</Button>
            <Button onClick={onLoad}>{t('load')}</Button>
            <div className="flex items-center gap-1">
              <IconButton onClick={onUndo} disabled={!canUndo} title={t('undo')}>
                  <UndoIcon className="w-4 h-4"/>
              </IconButton>
              <IconButton onClick={onRedo} disabled={!canRedo} title={t('redo')}>
                  <RedoIcon className="w-4 h-4"/>
              </IconButton>
            </div>
            <div className="flex items-center whitespace-nowrap ml-2 bg-white rounded-lg px-3 py-2 border border-gray-200 shadow-sm">
                <input 
                    type="checkbox" 
                    id="grid-toggle"
                    checked={isGridVisible}
                    onChange={(e) => onGridToggle(e.target.checked)}
                    className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="grid-toggle" className="text-sm text-gray-700 whitespace-nowrap font-medium">{t('toggleGrid')}</label>
            </div>
            <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as 'ja' | 'en')}
                className="px-3 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent whitespace-nowrap shadow-sm hover:shadow-md transition-all duration-200"
            >
                <option value="ja">日本語</option>
                <option value="en">EN</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;