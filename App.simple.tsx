import React, { useState, useCallback, useRef } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import Header from './components/Header';
import Palette from './components/Palette';
import Canvas from './components/Canvas';
import { LINE_THICKNESS, FONT_SIZES } from './constants';
import { CanvasState, Tool, CanvasElement } from './types';

const AppContent: React.FC = () => {
    const { t } = useLanguage();
    const [canvasState, setCanvasState] = useState<CanvasState>({ shapes: [], lines: [], boundaries: [], texts: [] });
    const [activeTool, setActiveTool] = useState<Tool>('select');
    const [selectedElements, setSelectedElements] = useState<CanvasElement[]>([]);
    const [lineThickness, setLineThickness] = useState<number>(LINE_THICKNESS.medium);
    const [fontSize, setFontSize] = useState<number>(FONT_SIZES.medium);
    const [isGridVisible] = useState(false);
    
    const nextId = useRef(1);
    const getNextId = useCallback(() => nextId.current++, []);
    
    const updateState = useCallback((updater: (prevState: CanvasState) => CanvasState) => {
        setCanvasState(updater);
    }, []);
    
    const moveSelectedElements = useCallback(() => {}, []);

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
                    <Canvas
                        canvasState={canvasState}
                        updateState={updateState}
                        activeTool={activeTool}
                        selectedElements={selectedElements}
                        setSelectedElements={setSelectedElements}
                        getNextId={getNextId}
                        lineThickness={lineThickness}
                        fontSize={fontSize}
                        moveSelectedElements={moveSelectedElements}
                        isGridVisible={isGridVisible}
                        onToolSelect={setActiveTool}
                    />
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