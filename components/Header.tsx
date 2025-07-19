
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { UndoIcon } from './icons/UndoIcon';
import { RedoIcon } from './icons/RedoIcon';
import { GridIcon } from './icons/GridIcon';
import { DeleteIcon } from './icons/DeleteIcon';

interface HeaderProps {
  onSave: () => void;
  onLoad: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onDelete: () => void;
  canDelete: boolean;
  isGridVisible: boolean;
  onGridToggle: (visible: boolean) => void;
}

const Button: React.FC<{onClick: () => void, children: React.ReactNode, className?: string, disabled?: boolean, title?: string}> = ({ onClick, children, className = '', disabled=false, title }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed ${className}`}
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
        className={`p-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed ${
            active 
            ? 'bg-indigo-100 text-indigo-700 border-indigo-300' 
            : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-100'
        }`}
    >
        {children}
    </button>
)


const Header: React.FC<HeaderProps> = ({ onSave, onLoad, onUndo, onRedo, canUndo, canRedo, onDelete, canDelete, isGridVisible, onGridToggle }) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="bg-gray-50 border-b border-gray-200 z-20 w-full">
      <div className="max-w-full mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          <h1 className="text-lg font-medium text-gray-800">{t('header')}</h1>
          <div className="flex items-center gap-3">
            <Button onClick={onSave}>{t('save')}</Button>
            <Button onClick={onLoad}>{t('load')}</Button>
            <IconButton onClick={onUndo} disabled={!canUndo} title={t('undo')}>
                <UndoIcon className="w-4 h-4"/>
            </IconButton>
            <IconButton onClick={onRedo} disabled={!canRedo} title={t('redo')}>
                <RedoIcon className="w-4 h-4"/>
            </IconButton>
            <div className="flex items-center">
                <input 
                    type="checkbox" 
                    id="grid-toggle"
                    checked={isGridVisible}
                    onChange={(e) => onGridToggle(e.target.checked)}
                    className="mr-2"
                />
                <label htmlFor="grid-toggle" className="text-sm text-gray-700">{t('toggleGrid')}</label>
            </div>
            <select 
                value={language} 
                onChange={(e) => setLanguage(e.target.value as 'ja' | 'en')}
                className="px-2 py-1 text-sm border border-gray-300 rounded bg-white text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
