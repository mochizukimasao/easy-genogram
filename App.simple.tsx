import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Header from './components/Header';
import Palette from './components/Palette';
import { LINE_THICKNESS, FONT_SIZES } from './constants';
import { CanvasState, Tool } from './types';

const AppContent: React.FC = () => {
    const { t } = useLanguage();
    const [canvasState] = useState<CanvasState>({ shapes: [], lines: [], boundaries: [], texts: [] });
    const [activeTool, setActiveTool] = useState<Tool>('select');
    const [lineThickness, setLineThickness] = useState<number>(LINE_THICKNESS.medium);
    const [fontSize, setFontSize] = useState<number>(FONT_SIZES.medium);
    const [isGridVisible] = useState(false);

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <Header 
                onUndo={() => {}}
                onRedo={() => {}}
                onToggleGrid={() => {}}
                isGridVisible={isGridVisible}
                onLoad={() => {}}
                onSave={() => {}}
                canUndo={false}
                canRedo={false}
            />
            <div className="flex flex-1 overflow-hidden">
                <Palette 
                    activeTool={activeTool}
                    onToolSelect={setActiveTool}
                    lineThickness={lineThickness}
                    onLineThicknessChange={setLineThickness}
                    fontSize={fontSize}
                    onFontSizeChange={setFontSize}
                />
                <main className="flex-1 overflow-auto bg-white">
                    <div className="p-8">
                        <h2 className="text-xl">Simple App Test</h2>
                        <p>State: {JSON.stringify({ shapes: canvasState.shapes.length, lines: canvasState.lines.length })}</p>
                        <p>Active tool: {activeTool}</p>
                        <p>Line thickness: {lineThickness}</p>
                    </div>
                </main>
            </div>
        </div>
    );
};

const App = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;