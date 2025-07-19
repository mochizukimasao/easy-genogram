
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
    className={`flex items-center justify-center w-full h-12 rounded-lg transition-all duration-200 
        ${activeTool === tool 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
    title={label}
  >
    {children}
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
        className={`flex-1 px-2 py-1 text-xs rounded transition-colors ${currentValue === value ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
    >
        {label}
    </button>
);

const Palette: React.FC<PaletteProps> = ({ activeTool, onToolSelect, lineThickness, onLineThicknessChange, fontSize, onFontSizeChange }) => {
  const { t } = useLanguage();
  return (
    <aside className="w-56 bg-white border-r border-gray-200 flex-shrink-0 overflow-y-auto">
      <div className="p-4 space-y-6">
        <div>
          <div className="flex space-x-2 mb-4">
            <ToolButton label={t('select')} tool="select" activeTool={activeTool} onSelect={onToolSelect}>
              <MousePointerIcon className="w-5 h-5"/>
            </ToolButton>
            <ToolButton label={t('textTool')} tool="text" activeTool={activeTool} onSelect={onToolSelect}>
              <TextIcon className="w-5 h-5"/>
            </ToolButton>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-4">
            <ToolButton label={t('boundary')} tool="boundary" activeTool={activeTool} onSelect={onToolSelect}>
              <CohabitingIcon className="w-5 h-5"/>
            </ToolButton>
            <ToolButton label={t('cohabitingTool')} tool="cohabiting" activeTool={activeTool} onSelect={onToolSelect}>
              <BoundaryIcon className="w-5 h-5"/>
            </ToolButton>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-3">{t('shapes')}</h3>
          <div className="grid grid-cols-2 gap-2">
            <ToolButton label={t('male')} tool={ShapeType.Male} activeTool={activeTool} onSelect={onToolSelect}>
              <MaleIcon className="w-5 h-5"/>
            </ToolButton>
            <ToolButton label={t('female')} tool={ShapeType.Female} activeTool={activeTool} onSelect={onToolSelect}>
              <FemaleIcon className="w-5 h-5"/>
            </ToolButton>
            <ToolButton label={t('indexM')} tool={ShapeType.IndexMale} activeTool={activeTool} onSelect={onToolSelect}>
              <IndexMaleIcon className="w-5 h-5"/>
            </ToolButton>
            <ToolButton label={t('indexF')} tool={ShapeType.IndexFemale} activeTool={activeTool} onSelect={onToolSelect}>
              <IndexFemaleIcon className="w-5 h-5"/>
            </ToolButton>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-3">{t('lines')}</h3>
          <div className="space-y-2">
            <ToolButton label={t('solidLine')} tool={LineType.Solid} activeTool={activeTool} onSelect={onToolSelect}>
              <div className="flex items-center">
                <div className="w-6 h-0 border-t-2 border-gray-600 mr-2"></div>
                <span className="text-sm">{t('solidLine')}</span>
              </div>
            </ToolButton>
            <ToolButton label={t('dotted')} tool={LineType.Dashed} activeTool={activeTool} onSelect={onToolSelect}>
              <div className="flex items-center">
                <div className="w-6 h-0 border-t-2 border-dashed border-gray-600 mr-2"></div>
                <span className="text-sm">{t('dotted')}</span>
              </div>
            </ToolButton>
            <ToolButton label={t('separation')} tool="separation" activeTool={activeTool} onSelect={onToolSelect}>
              <div className="flex items-center">
                <SeparationIcon className="w-5 h-5 mr-2"/>
                <span className="text-sm">{t('separation')}</span>
              </div>
            </ToolButton>
            <ToolButton label={t('divorce')} tool="divorce" activeTool={activeTool} onSelect={onToolSelect}>
              <div className="flex items-center">
                <DivorceIcon className="w-5 h-5 mr-2"/>
                <span className="text-sm">{t('divorce')}</span>
              </div>
            </ToolButton>
            <ToolButton label={t('deceased')} tool="deceased" activeTool={activeTool} onSelect={onToolSelect}>
              <div className="flex items-center">
                <DeceasedIcon className="w-5 h-5 mr-2"/>
                <span className="text-sm">{t('deceased')}</span>
              </div>
            </ToolButton>
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-3">{t('lineThickness')}</h3>
          <div className="flex space-x-1">
            <ControlButton label={t('small')} value={LINE_THICKNESS.thin} currentValue={lineThickness} onClick={onLineThicknessChange}/>
            <ControlButton label={t('medium')} value={LINE_THICKNESS.medium} currentValue={lineThickness} onClick={onLineThicknessChange}/>
            <ControlButton label={t('large')} value={LINE_THICKNESS.large} currentValue={lineThickness} onClick={onLineThicknessChange}/>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-800 mb-3">{t('fontSize')}</h3>
          <div className="flex space-x-1">
            <ControlButton label={t('small')} value={FONT_SIZES.small} currentValue={fontSize} onClick={onFontSizeChange}/>
            <ControlButton label={t('medium')} value={FONT_SIZES.medium} currentValue={fontSize} onClick={onFontSizeChange}/>
            <ControlButton label={t('large')} value={FONT_SIZES.large} currentValue={fontSize} onClick={onFontSizeChange}/>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Palette;
