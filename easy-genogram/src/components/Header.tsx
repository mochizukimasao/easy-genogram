
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
    <header className="bg-white shadow-md z-20 w-full">
      <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-between items-center py-2 sm:h-16">
          <h1 className="text-xl font-bold text-gray-800 w-full sm:w-auto text-center sm:text-left mb-2 sm:mb-0">{t('header')}</h1>
          <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 w-full sm:w-auto mx-auto">
             <div className="flex items-center space-x-1 border border-gray-300 rounded-md p-0.5">
                <button 
                    onClick={() => setLanguage('ja')} 
                    className={`px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${language === 'ja' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    日本語
                </button>
                <button 
                    onClick={() => setLanguage('en')} 
                    className={`px-3 py-1 text-xs sm:text-sm rounded-md transition-colors ${language === 'en' ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                >
                    EN
                </button>
            </div>
            <div className="flex items-center space-x-2">
                <IconButton onClick={() => onGridToggle(!isGridVisible)} active={isGridVisible} title={t('toggleGrid')}>
                    <GridIcon className="w-5 h-5"/>
                </IconButton>
                <IconButton onClick={onUndo} disabled={!canUndo} title={t('undo')}>
                    <UndoIcon className="w-5 h-5"/>
                </IconButton>
                <IconButton onClick={onRedo} disabled={!canRedo} title={t('redo')}>
                    <RedoIcon className="w-5 h-5"/>
                </IconButton>
                <IconButton onClick={onDelete} disabled={!canDelete} title={t('delete')}>
                    <DeleteIcon className="w-5 h-5"/>
                </IconButton>
            </div>
            <Button onClick={onLoad}>{t('load')}</Button>
            <Button onClick={onSave}>{t('save')}</Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;