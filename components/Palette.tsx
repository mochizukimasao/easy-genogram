import React from 'react';
import { Tool, ShapeType, LineType } from '../types';
import { MaleIcon, FemaleIcon, IndexMaleIcon, IndexFemaleIcon } from './icons/ShapeIcons';
import { RelationshipLineIcon, DashedLineIcon } from './icons/LineIcons';
import { MousePointerIcon, DeceasedIcon, SeparationIcon, DivorceIcon, EraseIcon } from './icons/UtilIcons';
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
    caption: string;
    tool: Tool;
    activeTool: Tool;
    onSelect: (tool: Tool) => void;
    children: React.ReactNode;
}> = ({ label, caption, tool, activeTool, onSelect, children }) => (
  <button
    onClick={() => onSelect(tool)}
    className={`flex flex-col items-center justify-center min-w-[3rem] h-10 px-3 rounded-lg gap-0.5 transition-all duration-200
        ${activeTool === tool 
          ? 'bg-blue-500 text-white shadow-md' 
          : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'}`}
    title={label}
  >
    {children}
    <span className="text-xs font-medium truncate">{caption}</span>
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
        className={`px-2 py-1 text-xs rounded transition-colors ${currentValue === value ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
    >
        {label}
    </button>
);

const Palette: React.FC<PaletteProps> = ({ activeTool, onToolSelect, lineThickness, onLineThicknessChange, fontSize, onFontSizeChange }) => {
  const { t } = useLanguage();
  return (
    <div className="bg-white border-b border-gray-200 px-3 py-2 overflow-x-auto">
      <div className="flex items-center gap-4 flex-nowrap">
        {/* 基本ツール */}
        <div className="flex items-center gap-1">
          <ToolButton label={t('select')} caption={t('captionSelect')} tool="select" activeTool={activeTool} onSelect={onToolSelect}>
            <MousePointerIcon className="w-4 h-4"/>
          </ToolButton>
          <ToolButton label={t('erase')} caption={t('captionErase')} tool="erase" activeTool={activeTool} onSelect={onToolSelect}>
            <EraseIcon className="w-4 h-4"/>
          </ToolButton>
          <ToolButton label={t('textTool')} caption={t('captionText')} tool="text" activeTool={activeTool} onSelect={onToolSelect}>
            <TextIcon className="w-4 h-4"/>
          </ToolButton>
        </div>

        {/* 図形 */}
        <div className="flex items-center gap-1">
          <ToolButton label={t('male')} caption={t('captionMale')} tool={ShapeType.Male} activeTool={activeTool} onSelect={onToolSelect}>
            <MaleIcon className="w-4 h-4"/>
          </ToolButton>
          <ToolButton label={t('female')} caption={t('captionFemale')} tool={ShapeType.Female} activeTool={activeTool} onSelect={onToolSelect}>
            <FemaleIcon className="w-4 h-4"/>
          </ToolButton>
          <ToolButton label={t('indexM')} caption={t('captionIndexM')} tool={ShapeType.IndexMale} activeTool={activeTool} onSelect={onToolSelect}>
            <IndexMaleIcon className="w-4 h-4"/>
          </ToolButton>
          <ToolButton label={t('indexF')} caption={t('captionIndexF')} tool={ShapeType.IndexFemale} activeTool={activeTool} onSelect={onToolSelect}>
            <IndexFemaleIcon className="w-4 h-4"/>
          </ToolButton>
        </div>

        {/* 線・関係 */}
        <div className="flex items-center gap-1">
          <ToolButton label={t('solidLine')} caption={t('captionSolid')} tool={LineType.Solid} activeTool={activeTool} onSelect={onToolSelect}>
            <RelationshipLineIcon className="w-4 h-4"/>
          </ToolButton>
          <ToolButton label={t('dotted')} caption={t('captionDashed')} tool={LineType.Dashed} activeTool={activeTool} onSelect={onToolSelect}>
            <DashedLineIcon className="w-4 h-4"/>
          </ToolButton>
          <ToolButton label={t('separation')} caption={t('captionSep')} tool="separation" activeTool={activeTool} onSelect={onToolSelect}>
            <SeparationIcon className="w-4 h-4"/>
          </ToolButton>
          <ToolButton label={t('divorce')} caption={t('captionDiv')} tool="divorce" activeTool={activeTool} onSelect={onToolSelect}>
            <DivorceIcon className="w-4 h-4"/>
          </ToolButton>
          <ToolButton label={t('deceased')} caption={t('captionDec')} tool="deceased" activeTool={activeTool} onSelect={onToolSelect}>
            <DeceasedIcon className="w-4 h-4"/>
          </ToolButton>
        </div>

        {/* その他のツール */}
        <div className="flex items-center gap-1">
          <ToolButton label={t('boundary')} caption={t('captionHouse')} tool="boundary" activeTool={activeTool} onSelect={onToolSelect}>
            <CohabitingIcon className="w-4 h-4"/>
          </ToolButton>
          <ToolButton label={t('cohabitingTool')} caption={t('captionBound')} tool="cohabiting" activeTool={activeTool} onSelect={onToolSelect}>
            <BoundaryIcon className="w-4 h-4"/>
          </ToolButton>
        </div>

        {/* 設定 */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600">{t('lineThickness')}</span>
            <ControlButton label={t('small')} value={LINE_THICKNESS.thin} currentValue={lineThickness} onClick={onLineThicknessChange}/>
            <ControlButton label={t('medium')} value={LINE_THICKNESS.medium} currentValue={lineThickness} onClick={onLineThicknessChange}/>
            <ControlButton label={t('large')} value={LINE_THICKNESS.large} currentValue={lineThickness} onClick={onLineThicknessChange}/>
          </div>
          
          <div className="flex items-center gap-1">
            <span className="text-xs text-gray-600 whitespace-nowrap">{t('fontSize')}</span>
            <ControlButton label={t('small')} value={FONT_SIZES.small} currentValue={fontSize} onClick={onFontSizeChange}/>
            <ControlButton label={t('medium')} value={FONT_SIZES.medium} currentValue={fontSize} onClick={onFontSizeChange}/>
            <ControlButton label={t('large')} value={FONT_SIZES.large} currentValue={fontSize} onClick={onFontSizeChange}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Palette;