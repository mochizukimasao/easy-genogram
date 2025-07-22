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
        className={`px-2 py-1 text-xs font-normal text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-400 whitespace-nowrap ${className}`}
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
        className={`p-1 border rounded focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            active 
            ? 'bg-blue-50 text-blue-600 border-blue-300' 
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
        }`}
    >
        {children}
    </button>
)


const Header: React.FC<HeaderProps> = ({ onSave, onLoad, onUndo, onRedo, canUndo, canRedo, isGridVisible, onGridToggle }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-white border-b border-gray-200 shadow-md z-20 w-full">
      <div className="max-w-full mx-auto px-4 overflow-x-auto">
        <div className="flex justify-between items-center h-16 flex-nowrap">
          <div className="flex flex-col">
            <h1 className="text-lg font-bold text-gray-800 whitespace-nowrap leading-tight">Easy Genogram</h1>
            <div className="text-xs text-gray-600 whitespace-nowrap">by mochizuki masao</div>
          </div>
          
          <div className="flex items-center gap-3 flex-nowrap">
            <div className="flex items-center gap-2">
              <Button onClick={onSave}>{t('save')}</Button>
              <Button onClick={onLoad}>{t('load')}</Button>
              <IconButton onClick={onUndo} disabled={!canUndo} title={t('undo')}>
                  <UndoIcon className="w-4 h-4"/>
              </IconButton>
              <IconButton onClick={onRedo} disabled={!canRedo} title={t('redo')}>
                  <RedoIcon className="w-4 h-4"/>
              </IconButton>
              <div className="flex items-center whitespace-nowrap ml-2">
                  <input 
                      type="checkbox" 
                      id="grid-toggle"
                      checked={isGridVisible}
                      onChange={(e) => onGridToggle(e.target.checked)}
                      className="mr-2 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="grid-toggle" className="text-sm text-gray-700 whitespace-nowrap">{t('toggleGrid')}</label>
              </div>
              <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as 'ja' | 'en')}
                  className="px-2 py-1.5 border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500 whitespace-nowrap"
              >
                  <option value="ja">日本語</option>
                  <option value="en">EN</option>
              </select>
            </div>
            
            <div className="h-6 w-px bg-gray-300 mx-2"></div>
            
            <div className="flex items-center gap-3">
              <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap">プライバシーポリシー</a>
              <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:text-blue-800 underline whitespace-nowrap">利用規約</a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;