
import React, { useState, useCallback, useRef, useEffect } from 'react';
import {
  GenogramShape,
  GenogramLine,
  Tool,
  CanvasElement,
  ShapeType,
  LineType,
  GenogramBoundary,
  CanvasState,
  LineDecoration,
  GenogramText
} from './types';
import { GRID_SIZE, SVG_CANVAS_ID, SHAPE_SIZE, LINE_THICKNESS, FONT_SIZES } from './constants';
import Header from './components/Header';
import Palette from './components/Palette';
import Canvas from './components/Canvas';
import SaveModal from './components/SaveModal';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const MAX_HISTORY_SIZE = 50;

const AppContent: React.FC = () => {
    const { t } = useLanguage();
    const [canvasState, setCanvasState] = useState<CanvasState>({ shapes: [], lines: [], boundaries: [], texts: [] });
    const [activeTool, setActiveTool] = useState<Tool>('select');
    const [selectedElements, setSelectedElements] = useState<CanvasElement[]>([]);
    const [lineThickness, setLineThickness] = useState<number>(LINE_THICKNESS.medium);
    const [fontSize, setFontSize] = useState<number>(FONT_SIZES.medium);
    const [isGridVisible, setIsGridVisible] = useState(true);

    const history = useRef<CanvasState[]>([canvasState]);
    const historyIndex = useRef<number>(0);
    const nextId = useRef<number>(1);

    const [isSaveModalOpen, setSaveModalOpen] = useState(false);

    const updateState = useCallback((updater: (prevState: CanvasState) => CanvasState, selection?: CanvasElement[]) => {
        const currentState = history.current[historyIndex.current];
        const newState = updater(currentState);
        
        if(JSON.stringify(currentState) === JSON.stringify(newState)) return;
        
        if (historyIndex.current < history.current.length - 1) {
            history.current = history.current.slice(0, historyIndex.current + 1);
        }
        history.current.push(newState);
        if (history.current.length > MAX_HISTORY_SIZE) {
            history.current.shift();
        }
        historyIndex.current = history.current.length - 1;
        
        setCanvasState(newState);
        if (selection !== undefined) {
            setSelectedElements(selection);
        }
    }, []);

    const getNextId = useCallback(() => nextId.current++, []);
    
    const handleUndo = useCallback(() => {
        if (historyIndex.current > 0) {
            historyIndex.current -= 1;
            const previousState = history.current[historyIndex.current];
            setCanvasState(previousState);
            setSelectedElements([]);
        }
    }, []);

    const handleRedo = useCallback(() => {
        if (historyIndex.current < history.current.length - 1) {
            historyIndex.current += 1;
            const nextState = history.current[historyIndex.current];
            setCanvasState(nextState);
            setSelectedElements([]);
        }
    }, []);
    
    const deleteSelectedElements = useCallback(() => {
        if (selectedElements.length === 0) return;
        updateState(prev => {
            const selectedShapeIds = new Set(selectedElements.filter(el => el.type === 'shape').map(el => el.id));
            const selectedLineIds = new Set(selectedElements.filter(el => el.type === 'line').map(el => el.id));
            const selectedBoundaryIds = new Set(selectedElements.filter(el => el.type === 'boundary').map(el => el.id));
            const selectedTextIds = new Set(selectedElements.filter(el => el.type === 'text').map(el => el.id));
            return {
                shapes: prev.shapes.filter(s => !selectedShapeIds.has(s.id)),
                lines: prev.lines.filter(l => !selectedLineIds.has(l.id)),
                boundaries: prev.boundaries.filter(b => !selectedBoundaryIds.has(b.id)),
                texts: prev.texts.filter(t => !selectedTextIds.has(t.id)),
            };
        }, []);
    }, [selectedElements, updateState]);

    const handleToolSelect = (tool: Tool) => {
      setActiveTool(tool);
      if (tool !== 'select') {
          setSelectedElements([]);
      }
    };
    
    const calculateBounds = (padding: number) => {
        const { shapes, lines, boundaries, texts } = canvasState;
    
        if (shapes.length === 0 && lines.length === 0 && boundaries.length === 0 && texts.length === 0) {
            return null;
        }
    
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
        shapes.forEach(s => {
            let textHeight = 0;
            if (s.text) {
                textHeight += 18;
            }
            if (s.isCohabitingWithIndex) {
                textHeight += 16;
            }
            minX = Math.min(minX, s.x - s.width / 2 - 5);
            minY = Math.min(minY, s.y - s.height / 2 - 5);
            maxX = Math.max(maxX, s.x + s.width / 2 + 5);
            maxY = Math.max(maxY, s.y + s.height / 2 + 5 + textHeight);
        });
    
        lines.forEach(l => {
            const strokeOffset = l.strokeWidth + 10;
            minX = Math.min(minX, l.start.x - strokeOffset, l.end.x - strokeOffset);
            minY = Math.min(minY, l.start.y - strokeOffset, l.end.y - strokeOffset);
            maxX = Math.max(maxX, l.start.x + strokeOffset, l.end.x + strokeOffset);
            maxY = Math.max(maxY, l.start.y + strokeOffset, l.end.y + strokeOffset);
        });
    
        boundaries.forEach(b => {
            minX = Math.min(minX, b.x - 2);
            minY = Math.min(minY, b.y - 2);
            maxX = Math.max(maxX, b.x + b.width + 2);
            maxY = Math.max(maxY, b.y + b.height + 2 + 20);
        });
        
        texts.forEach(t => {
            minX = Math.min(minX, t.x);
            minY = Math.min(minY, t.y);
            maxX = Math.max(maxX, t.x + t.width);
            maxY = Math.max(maxY, t.y + t.height);
        });
    
        if (!isFinite(minX)) {
            return null;
        }
    
        return {
            x: minX - padding,
            y: minY - padding,
            width: (maxX - minX) + padding * 2,
            height: (maxY - minY) + padding * 2,
        };
    };

    const prepareSvgForExport = (padding: number, includeBackground: boolean): { clonedSvg: SVGSVGElement, bounds: { x: number, y: number, width: number, height: number } } | null => {
        const svgElement = document.getElementById(SVG_CANVAS_ID) as unknown as SVGSVGElement;
        if (!svgElement) return null;

        const bounds = calculateBounds(padding);
        if (!bounds) return null;

        const clonedSvg = svgElement.cloneNode(true) as SVGSVGElement;
    
        const gridGroup = clonedSvg.querySelector('#grid-group');
        if (gridGroup) gridGroup.remove();

        if (includeBackground) {
            const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bgRect.setAttribute('x', String(bounds.x));
            bgRect.setAttribute('y', String(bounds.y));
            bgRect.setAttribute('width', String(bounds.width));
            bgRect.setAttribute('height', String(bounds.height));
            bgRect.setAttribute('fill', 'white');
            clonedSvg.insertBefore(bgRect, clonedSvg.firstChild);
        }
    
        clonedSvg.setAttribute('width', `${bounds.width}`);
        clonedSvg.setAttribute('height', `${bounds.height}`);
        clonedSvg.setAttribute('viewBox', `${bounds.x} ${bounds.y} ${bounds.width} ${bounds.height}`);

        return { clonedSvg, bounds };
    };

    const handleSaveSVG = (padding: number, includeBackground: boolean) => {
        const prepared = prepareSvgForExport(padding, includeBackground);
        if (!prepared) return;
        
        const { clonedSvg } = prepared;

        const serializer = new XMLSerializer();
        let svgString = serializer.serializeToString(clonedSvg);
        
        const data = `<!-- genogram-data: ${btoa(JSON.stringify(canvasState))} -->`;
        svgString = svgString.replace('</svg>', `${data}\n</svg>`);

        const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'genogram.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setSaveModalOpen(false);
    };

    const handleSavePNG = (padding: number, includeBackground: boolean) => {
        const prepared = prepareSvgForExport(padding, includeBackground);
        if (!prepared) return;

        const { clonedSvg, bounds } = prepared;
        
        const serializer = new XMLSerializer();
        const svgString = serializer.serializeToString(clonedSvg);
        const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);

        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            const scale = 2;
            canvas.width = bounds.width * scale;
            canvas.height = bounds.height * scale;
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.scale(scale, scale);
                ctx.drawImage(image, 0, 0);
                const pngUrl = canvas.toDataURL('image/png');
                const a = document.createElement('a');
                a.href = pngUrl;
                a.download = 'genogram.png';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(pngUrl);
            }
            URL.revokeObjectURL(url);
            setSaveModalOpen(false);
        };
        image.onerror = () => {
            alert(t('pngSaveError'));
            URL.revokeObjectURL(url);
            setSaveModalOpen(false);
        };
        image.src = url;
    };

    const handleLoad = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.svg';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (readEvent) => {
                    const fileContent = readEvent.target?.result as string;
                    const dataMatch = fileContent.match(/<!-- genogram-data: (.*?) -->/);
                    if (dataMatch && dataMatch[1]) {
                        try {
                            const decodedData = atob(dataMatch[1]);
                            const loadedState = JSON.parse(decodedData) as CanvasState;
    
                            if (loadedState && typeof loadedState === 'object') {
                                const sanitizedState: CanvasState = {
                                    shapes: loadedState.shapes || [],
                                    lines: loadedState.lines || [],
                                    boundaries: loadedState.boundaries || [],
                                    texts: loadedState.texts || [],
                                };
                                
                                const maxId = Math.max(
                                    0,
                                    ...sanitizedState.shapes.map(s => s.id),
                                    ...sanitizedState.lines.map(l => l.id),
                                    ...sanitizedState.boundaries.map(b => b.id),
                                    ...sanitizedState.texts.map(t => t.id),
                                );
                                nextId.current = (isFinite(maxId) ? maxId : 0) + 1;
                                
                                history.current = [sanitizedState];
                                historyIndex.current = 0;
                                setCanvasState(sanitizedState);
                                setSelectedElements([]);
                            } else {
                                throw new Error("Invalid data structure");
                            }
                        } catch (error) {
                            console.error("Failed to parse genogram data:", error);
                            alert(t('loadError'));
                        }
                    } else {
                        alert(t('loadError'));
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const moveSelectedElements = useCallback((dx: number, dy: number) => {
        updateState(prev => {
            const selectedShapeIds = new Set(selectedElements.filter(el => el.type === 'shape').map(el => el.id));
            const selectedLineIds = new Set(selectedElements.filter(el => el.type === 'line').map(el => el.id));
            const selectedBoundaryIds = new Set(selectedElements.filter(el => el.type === 'boundary').map(el => el.id));
            const selectedTextIds = new Set(selectedElements.filter(el => el.type === 'text').map(el => el.id));

            return {
                shapes: prev.shapes.map(s => selectedShapeIds.has(s.id) ? { ...s, x: s.x + dx, y: s.y + dy } : s),
                lines: prev.lines.map(l => selectedLineIds.has(l.id) ? { ...l, start: { x: l.start.x + dx, y: l.start.y + dy }, end: { x: l.end.x + dx, y: l.end.y + dy } } : l),
                boundaries: prev.boundaries.map(b => selectedBoundaryIds.has(b.id) ? { ...b, x: b.x + dx, y: b.y + dy } : b),
                texts: prev.texts.map(t => selectedTextIds.has(t.id) ? { ...t, x: t.x + dx, y: t.y + dy } : t)
            };
        }, selectedElements);
    }, [selectedElements, updateState]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const target = e.target as HTMLElement;
            if (target.tagName.toLowerCase() === 'input' || target.tagName.toLowerCase() === 'textarea' || target.isContentEditable) {
                return;
            }

            if (e.key === 'Delete' || e.key === 'Backspace') {
                e.preventDefault();
                deleteSelectedElements();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
                e.preventDefault();
                handleUndo();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
                e.preventDefault();
                handleRedo();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [deleteSelectedElements, handleUndo, handleRedo]);

    return (
        <div className="flex flex-col h-screen bg-gray-100 font-sans overflow-hidden">
            <Header 
                onSave={() => setSaveModalOpen(true)}
                onLoad={handleLoad}
                onUndo={handleUndo}
                onRedo={handleRedo}
                canUndo={historyIndex.current > 0}
                canRedo={historyIndex.current < history.current.length - 1}
                onDelete={deleteSelectedElements}
                canDelete={selectedElements.length > 0}
                isGridVisible={isGridVisible}
                onGridToggle={setIsGridVisible}
            />
            <div className="flex flex-col sm:flex-row flex-1 min-h-0">
                <Palette
                    activeTool={activeTool}
                    onToolSelect={handleToolSelect}
                    lineThickness={lineThickness}
                    onLineThicknessChange={setLineThickness}
                    fontSize={fontSize}
                    onFontSizeChange={setFontSize}
                />
                <main className="flex-1 overflow-auto p-2 sm:p-4 bg-gray-200">
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
                        onToolSelect={handleToolSelect}
                    />
                </main>
            </div>
            <div className="p-2 bg-gray-100 text-center text-xs text-gray-500 border-t">
                <p>{t('tip')}</p>
            </div>
            <SaveModal 
                isOpen={isSaveModalOpen}
                onClose={() => setSaveModalOpen(false)}
                onSaveSVG={handleSaveSVG}
                onSavePNG={handleSavePNG}
            />
        </div>
    );
};

const App = () => (
  <LanguageProvider>
    <AppContent />
  </LanguageProvider>
);

export default App;
