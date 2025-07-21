import React from 'react';
import { Tool, ShapeType, LineType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ToolHintProps {
  activeTool: Tool;
}

const ToolHint: React.FC<ToolHintProps> = ({ activeTool }) => {
  const { t } = useLanguage();

  const getToolHint = (tool: Tool): string => {
    const hints = {
      ja: {
        'select': 'クリックして要素を選択、ドラッグで移動、Deleteキーで削除',
        'erase': 'クリックして要素を削除',
        'text': 'クリックしてテキストを追加',
        [ShapeType.Male]: 'クリックして男性シンボルを配置',
        [ShapeType.Female]: 'クリックして女性シンボルを配置',
        [ShapeType.IndexMale]: 'クリックしてIP（男性）シンボルを配置',
        [ShapeType.IndexFemale]: 'クリックしてIP（女性）シンボルを配置',
        [LineType.Solid]: '2つの要素をクリックして線で結ぶ（線種は設定で選択）',
        'separation': '線を選択してから使用、関係の分離を表示',
        'divorce': '線を選択してから使用、離婚を表示',
        'deceased': 'シンボルを選択してから使用、故人を表示',
        'boundary': 'ドラッグして家族境界を描画',
        'cohabiting': 'ドラッグして同居範囲を描画',
        'default': 'ツールを選択してください'
      },
      en: {
        'select': 'Click to select elements, drag to move, Delete key to remove',
        'erase': 'Click to delete elements',
        'text': 'Click to add text',
        [ShapeType.Male]: 'Click to place male symbol',
        [ShapeType.Female]: 'Click to place female symbol',
        [ShapeType.IndexMale]: 'Click to place IP (male) symbol',
        [ShapeType.IndexFemale]: 'Click to place IP (female) symbol',
        [LineType.Solid]: 'Click two elements to connect with line (style set in options)',
        'separation': 'Select a line first, then use to show separation',
        'divorce': 'Select a line first, then use to show divorce',
        'deceased': 'Select a symbol first, then use to show deceased',
        'boundary': 'Drag to draw family boundary',
        'cohabiting': 'Drag to draw cohabiting area',
        'default': 'Select a tool to get started'
      }
    };

    const { language } = useLanguage();
    const langHints = hints[language as keyof typeof hints];
    return langHints[tool as keyof typeof langHints] || langHints.default;
  };

  return (
    <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-black bg-opacity-75 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap">
        {getToolHint(activeTool)}
      </div>
    </div>
  );
};

export default ToolHint;