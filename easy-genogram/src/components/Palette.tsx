
import React from 'react';
import { Tool, ShapeType, LineType } from '../types';
import { MaleIcon, FemaleIcon, IndexMaleIcon, IndexFemaleIcon } from './icons/ShapeIcons';
import { RelationshipLineIcon, DashedLineIcon } from './icons/LineIcons';
import { MousePointerIcon, DeceasedIcon, SeparationIcon, DivorceIcon } from './icons/UtilIcons';
import { BoundaryIcon } from './icons/BoundaryIcon';
import { useLanguage } from '../contexts/LanguageContext';
import { LINE_THICKNESS, FONT_SIZES } from '../constants';
import { CohabitingIcon } from './icons/CohabitingIcon';
import { TextIcon } from './icons/TextIcon';

interface PaletteProps {
  activeTool: Tool;
  onToolSelect: (tool: Tool) => void;
  lineThickness: number;
  onLineThicknessChange: (width: number) => void;
  fontSize: number;
  onFontSizeChange: (size: number) => void;
}

const ToolButton: React.FC<{
    label: string;
    tool: Tool;
    activeTool: Tool;
    onSelect: (tool: Tool) => void;
    children: React.ReactNode;
}> = ({ label, tool, activeTool, onSelect, children }) => (
  <button
    onClick={() => onSelect(tool)}
    className={`flex flex-col items-center justify-center w-20 sm:w-full p-2 space-y-1 rounded-lg transition-colors duration-150
        ${activeTool === tool ? 'bg-indigo-200 text-indigo-800' : 'hover:bg-gray-300 text-gray-600'}`}
    title={label}
  >
    {children}
    <span className="text-xs font-medium">{label}</span>
  </button>
);

const ControlButton: React.FC<{
    label: string;
    value: number;
    currentValue: number;
    onClick: (value: number) => void;
}> = ({ label, value, currentValue, onClick }) => (
    <button
        onClick={() => onClick(value)}
        className={`flex-1 px-1 py-1 text-xs rounded-md transition-colors ${currentValue === value ? 'bg-indigo-600 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
    >
        {label}
    </button>
);

const Palette: React.FC<PaletteProps> = ({ activeTool, onToolSelect, lineThickness, onLineThicknessChange, fontSize, onFontSizeChange }) => {
  const { t } = useLanguage();
  return (
    <aside className="w-full sm:w-48 p-2 sm:p-4 flex flex-row sm:flex-col items-center sm:items-stretch gap-4 sm:gap-6 overflow-x-auto sm:overflow-y-auto sm:overflow-x-hidden whitespace-nowrap sm:whitespace-normal bg-gray-100 flex-shrink-0">
      <div className="flex-shrink-0">
        <h3 className="hidden sm:block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('tools')}</h3>
        <div className="flex flex-row sm:grid sm:grid-cols-2 gap-2">
            <ToolButton label={t('select')} tool="select" activeTool={activeTool} onSelect={onToolSelect}>
                <MousePointerIcon className="w-8 h-8"/>
            </ToolButton>
            <ToolButton label={t('textTool')} tool="text" activeTool={activeTool} onSelect={onToolSelect}>
                <TextIcon className="w-8 h-8"/>
            </ToolButton>
            <ToolButton label={t('boundary')} tool="boundary" activeTool={activeTool} onSelect={onToolSelect}>
                <BoundaryIcon className="w-8 h-8"/>
            </ToolButton>
            <ToolButton label={t('deceased')} tool="deceased" activeTool={activeTool} onSelect={onToolSelect}>
                <DeceasedIcon className="w-8 h-8"/>
            </ToolButton>
            <ToolButton label={t('separation')} tool="separation" activeTool={activeTool} onSelect={onToolSelect}>
                <SeparationIcon className="w-8 h-8"/>
            </ToolButton>
             <ToolButton label={t('divorce')} tool="divorce" activeTool={activeTool} onSelect={onToolSelect}>
                <DivorceIcon className="w-8 h-8"/>
            </ToolButton>
            <ToolButton label={t('cohabitingTool')} tool="cohabiting" activeTool={activeTool} onSelect={onToolSelect}>
                <CohabitingIcon className="w-8 h-8"/>
            </ToolButton>
        </div>
      </div>
      <div className="flex-shrink-0">
        <h3 className="hidden sm:block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('shapes')}</h3>
        <div className="flex flex-row sm:grid sm:grid-cols-2 gap-2">
          <ToolButton label={t('male')} tool={ShapeType.Male} activeTool={activeTool} onSelect={onToolSelect}>
            <MaleIcon className="w-8 h-8"/>
          </ToolButton>
          <ToolButton label={t('female')} tool={ShapeType.Female} activeTool={activeTool} onSelect={onToolSelect}>
            <FemaleIcon className="w-8 h-8"/>
          </ToolButton>
          <ToolButton label={t('indexM')} tool={ShapeType.IndexMale} activeTool={activeTool} onSelect={onToolSelect}>
            <IndexMaleIcon className="w-8 h-8"/>
          </ToolButton>
          <ToolButton label={t('indexF')} tool={ShapeType.IndexFemale} activeTool={activeTool} onSelect={onToolSelect}>
            <IndexFemaleIcon className="w-8 h-8"/>
          </ToolButton>
        </div>
      </div>
      <div className="flex-shrink-0">
        <h3 className="hidden sm:block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('lines')}</h3>
        <div className="flex flex-row sm:grid sm:grid-cols-2 gap-2">
            <ToolButton label={t('solidLine')} tool={LineType.Solid} activeTool={activeTool} onSelect={onToolSelect}>
                <RelationshipLineIcon className="w-8 h-8"/>
            </ToolButton>
            <ToolButton label={t('dotted')} tool={LineType.Dashed} activeTool={activeTool} onSelect={onToolSelect}>
                <DashedLineIcon className="w-8 h-8"/>
            </ToolButton>
        </div>
      </div>
      <div className="flex-shrink-0 w-32 sm:w-auto">
        <h3 className="hidden sm:block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('lineThickness')}</h3>
        <div className="flex items-center space-x-1 bg-gray-100 border border-gray-300 rounded-md p-0.5">
            <ControlButton label={t('thin')} value={LINE_THICKNESS.thin} currentValue={lineThickness} onClick={onLineThicknessChange}/>
            <ControlButton label={t('medium')} value={LINE_THICKNESS.medium} currentValue={lineThickness} onClick={onLineThicknessChange}/>
            <ControlButton label={t('thick')} value={LINE_THICKNESS.large} currentValue={lineThickness} onClick={onLineThicknessChange}/>
        </div>
      </div>
       <div className="flex-shrink-0 w-32 sm:w-auto">
        <h3 className="hidden sm:block text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">{t('fontSize')}</h3>
        <div className="flex items-center space-x-1 bg-gray-100 border border-gray-300 rounded-md p-0.5">
            <ControlButton label={t('small')} value={FONT_SIZES.small} currentValue={fontSize} onClick={onFontSizeChange}/>
            <ControlButton label={t('medium')} value={FONT_SIZES.medium} currentValue={fontSize} onClick={onFontSizeChange}/>
            <ControlButton label={t('large')} value={FONT_SIZES.large} currentValue={fontSize} onClick={onFontSizeChange}/>
        </div>
      </div>
    </aside>
  );
};

export default Palette;