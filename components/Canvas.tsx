import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GenogramShape, GenogramLine, Tool, CanvasElement, Point, ShapeType, LineType, CanvasState, GenogramBoundary, Handle, LineDecoration, GenogramText } from '../types';
import { GRID_SIZE, SHAPE_SIZE, SVG_CANVAS_ID, FONT_SIZES, CANVAS_WIDTH, CANVAS_HEIGHT } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import ShapeComponent from './ShapeComponent';

// --- UTILITY FUNCTIONS ---
const snapToGrid = (value: number) => Math.round(value / (GRID_SIZE / 2)) * (GRID_SIZE / 2);

const getElementAtPosition = (x: number, y: number, canvasState: CanvasState, selectedElements: CanvasElement[]): { element: CanvasElement, handle?: Handle } | null => {
    // Check for resize handles on selected elements first
    for (const selected of selectedElements) {
        if (selected.type === 'line') {
            const line = canvasState.lines.find(l => l.id === selected.id);
            if (line) {
                if (Math.hypot(x - line.start.x, y - line.start.y) < 8) return { element: selected, handle: 'line-start' };
                if (Math.hypot(x - line.end.x, y - line.end.y) < 8) return { element: selected, handle: 'line-end' };
            }
        }
        if (selected.type === 'text') {
            const text = canvasState.texts.find(t => t.id === selected.id);
            if(text){
                if (x >= text.x + text.width - 5 && x <= text.x + text.width + 5 && y >= text.y + text.height - 5 && y <= text.y + text.height + 5) {
                    return { element: selected, handle: 'text-resize-br' };
                }
            }
        }
        if (selected.type === 'boundary') {
            const boundary = canvasState.boundaries.find(b => b.id === selected.id);
            if (boundary) {
                const { x: bx, y: by, width: bw, height: bh } = boundary;
                const handles: { name: Handle; x: number; y: number }[] = [
                    { name: 'top-left', x: bx, y: by },
                    { name: 'top-center', x: bx + bw / 2, y: by },
                    { name: 'top-right', x: bx + bw, y: by },
                    { name: 'middle-left', x: bx, y: by + bh / 2 },
                    { name: 'middle-right', x: bx + bw, y: by + bh / 2 },
                    { name: 'bottom-left', x: bx, y: by + bh },
                    { name: 'bottom-center', x: bx + bw / 2, y: by + bh },
                    { name: 'bottom-right', x: bx + bw, y: by + bh },
                ];
                for (const handle of handles) {
                    if (Math.hypot(x - handle.x, y - handle.y) < 8) {
                        return { element: selected, handle: handle.name };
                    }
                }
            }
        }
    }
    
    // Check text boxes
    for (const text of [...canvasState.texts].reverse()) {
        if (x >= text.x && x <= text.x + text.width && y >= text.y && y <= text.y + text.height) {
            return { element: { type: 'text', id: text.id } };
        }
    }

    // Check shapes
    for (const shape of [...canvasState.shapes].reverse()) {
        const shapeBottom = shape.y + shape.height / 2;
        let totalHeight = shape.height;
        if(shape.text) totalHeight += 18;
        if(shape.isCohabitingWithIndex) totalHeight += 14;

        if (x >= shape.x - shape.width / 2 && x <= shape.x + shape.width / 2 && y >= shape.y - shape.height / 2 && y <= shape.y + shape.height/2 + (totalHeight - shape.height) ) {
            return { element: { type: 'shape', id: shape.id } };
        }
    }
    // Check lines
    for (const line of [...canvasState.lines].reverse()) {
        const { start, end } = line;
        const lenSq = (end.x - start.x) ** 2 + (end.y - start.y) ** 2;
        if (lenSq === 0) continue;
        let t = ((x - start.x) * (end.x - start.x) + (y - start.y) * (end.y - start.y)) / lenSq;
        t = Math.max(0, Math.min(1, t));
        const projX = start.x + t * (end.x - start.x);
        const projY = start.y + t * (end.y - start.y);
        const dist = Math.sqrt((x - projX) ** 2 + (y - projY) ** 2);
        
        if (dist < 5 + line.strokeWidth) {
             return { element: { type: 'line', id: line.id } };
        }
    }
    // Check boundaries
    for (const boundary of [...canvasState.boundaries].reverse()) {
       const BORDER_SENSITIVITY = 15;
       const onBorder = (x > boundary.x && x < boundary.x + boundary.width && y > boundary.y && y < boundary.y + boundary.height) &&
                         ! (x > boundary.x + BORDER_SENSITIVITY && x < boundary.x + boundary.width - BORDER_SENSITIVITY && y > boundary.y + BORDER_SENSITIVITY && y < boundary.y + boundary.height - BORDER_SENSITIVITY);
        if (onBorder) return { element: { type: 'boundary', id: boundary.id } };
    }
    return null;
};

// --- RENDER COMPONENTS ---

const TextComponent: React.FC<{
  text: GenogramText;
  isSelected: boolean;
  isEditing: boolean;
  onTextChange: (id: number, newText: string) => void;
}> = ({ text, isSelected, isEditing, onTextChange }) => {
  const { x, y, width, height, fontSize, text: content } = text;
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.select();
    }
  }, [isEditing]);
  
  return (
    <g>
        <foreignObject x={x} y={y} width={width} height={height} style={{ overflow: 'visible', pointerEvents: isEditing ? 'auto': 'none' }}>
            <div
                style={{
                    backgroundColor: 'transparent',
                    width: '100%',
                    height: '100%',
                    padding: '4px',
                    fontSize: `${fontSize + 4}px`,
                    fontWeight: 'bold',
                    lineHeight: 1.2,
                    fontFamily: 'sans-serif',
                    wordWrap: 'break-word',
                    color: 'black',
                    whiteSpace: 'pre-wrap',
                    display: isEditing ? 'none' : 'block',
                }}
            >
                {content}
            </div>
            {isEditing && (
                <textarea
                    ref={textareaRef}
                    value={content}
                    onChange={(e) => onTextChange(text.id, e.target.value)}
                    style={{
                        width: '100%',
                        height: '100%',
                        border: '1px solid #4f46e5',
                        background: 'rgba(255, 255, 255, 0.9)',
                        outline: 'none',
                        resize: 'none',
                        padding: '4px',
                        fontSize: `${fontSize + 4}px`,
                        fontWeight: 'bold',
                        lineHeight: 1.2,
                        fontFamily: 'sans-serif',
                        color: 'black',
                    }}
                />
            )}
        </foreignObject>
        {isSelected && !isEditing && (
           <>
             <rect
                x={x} y={y} width={width} height={height}
                fill="none" stroke="#4f46e5" strokeWidth="1" strokeDasharray="4 4" style={{pointerEvents: 'none'}}
             />
             <rect
                x={x + width - 5} y={y + height - 5} width="10" height="10"
                fill="#4f46e5" cursor="nwse-resize"
             />
           </>
        )}
    </g>
  );
};

const LineComponent: React.FC<{
  line: GenogramLine;
  isSelected: boolean;
}> = ({ line, isSelected }) => {
    const { start, end, type, strokeWidth, decoration } = line;
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const angle = Math.atan2(end.y - start.y, end.x - start.x) * 180 / Math.PI;

    return (
        <g>
            <line
                x1={start.x} y1={start.y} x2={end.x} y2={end.y}
                stroke="black"
                strokeWidth={strokeWidth}
                strokeDasharray={type === LineType.Dashed ? '8 8' : 'none'}
                style={{ pointerEvents: 'stroke' }}
            />
            {decoration && (
                <g transform={`translate(${midX}, ${midY}) rotate(${angle})`} stroke="black" strokeWidth={strokeWidth * 1.5} strokeLinecap="round">
                    {decoration === 'separation' && <line x1="0" y1="-10" x2="0" y2="10" transform="rotate(30)" />}
                    {decoration === 'divorce' && (
                        <>
                            <line x1="0" y1="-10" x2="0" y2="10" transform="rotate(30) translate(-4, 0)" />
                            <line x1="0" y1="-10" x2="0" y2="10" transform="rotate(30) translate(4, 0)" />
                        </>
                    )}
                </g>
            )}
            {isSelected && (
                <g>
                   <line
                      x1={start.x} y1={start.y} x2={end.x} y2={end.y}
                      stroke="#4f46e5" strokeWidth={strokeWidth + 5} strokeOpacity="0.5"
                   />
                    <circle cx={start.x} cy={start.y} r="6" fill="#4f46e5" cursor="move" />
                    <circle cx={end.x} cy={end.y} r="6" fill="#4f46e5" cursor="move" />
                </g>
            )}
        </g>
    );
};

const BoundaryComponent: React.FC<{
  boundary: GenogramBoundary;
  isSelected: boolean;
}> = ({ boundary, isSelected }) => {
  const HANDLE_SIZE = 8;
  return (
    <g>
      <rect
        x={boundary.x}
        y={boundary.y}
        width={boundary.width}
        height={boundary.height}
        fill="none"
        stroke="black"
        strokeWidth="2"
        strokeDasharray="8 4"
        rx="10"
        ry="10"
        style={{ pointerEvents: 'stroke' }}
      />
      <text
        x={boundary.x + boundary.width / 2}
        y={boundary.y + boundary.height + 15}
        textAnchor="middle"
        fontSize={FONT_SIZES.medium}
        fill="#333"
        fontFamily="sans-serif"
        style={{ pointerEvents: 'none' }}
        stroke="#f9f9f9"
        strokeWidth="4px"
        strokeLinejoin="round"
        paintOrder="stroke"
      >
        {boundary.label}
      </text>
      {isSelected && (
        <>
            <rect
            x={boundary.x - 2}
            y={boundary.y - 2}
            width={boundary.width + 4}
            height={boundary.height + 4}
            rx="12"
            ry="12"
            fill="none"
            stroke="#4f46e5"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            style={{ pointerEvents: 'none' }}
            />
            {/* Handles */}
            <rect x={boundary.x - HANDLE_SIZE/2} y={boundary.y - HANDLE_SIZE/2} width={HANDLE_SIZE} height={HANDLE_SIZE} fill="#4f46e5" cursor="nwse-resize" />
            <rect x={boundary.x + boundary.width - HANDLE_SIZE/2} y={boundary.y - HANDLE_SIZE/2} width={HANDLE_SIZE} height={HANDLE_SIZE} fill="#4f46e5" cursor="nesw-resize" />
            <rect x={boundary.x - HANDLE_SIZE/2} y={boundary.y + boundary.height - HANDLE_SIZE/2} width={HANDLE_SIZE} height={HANDLE_SIZE} fill="#4f46e5" cursor="nesw-resize" />
            <rect x={boundary.x + boundary.width - HANDLE_SIZE/2} y={boundary.y + boundary.height - HANDLE_SIZE/2} width={HANDLE_SIZE} height={HANDLE_SIZE} fill="#4f46e5" cursor="nwse-resize" />
            
            <rect x={boundary.x + boundary.width/2 - HANDLE_SIZE/2} y={boundary.y - HANDLE_SIZE/2} width={HANDLE_SIZE} height={HANDLE_SIZE} fill="#4f46e5" cursor="ns-resize" />
            <rect x={boundary.x + boundary.width/2 - HANDLE_SIZE/2} y={boundary.y + boundary.height - HANDLE_SIZE/2} width={HANDLE_SIZE} height={HANDLE_SIZE} fill="#4f46e5" cursor="ns-resize" />
            <rect x={boundary.x - HANDLE_SIZE/2} y={boundary.y + boundary.height/2 - HANDLE_SIZE/2} width={HANDLE_SIZE} height={HANDLE_SIZE} fill="#4f46e5" cursor="ew-resize" />
            <rect x={boundary.x + boundary.width - HANDLE_SIZE/2} y={boundary.y + boundary.height/2 - HANDLE_SIZE/2} width={HANDLE_SIZE} height={HANDLE_SIZE} fill="#4f46e5" cursor="ew-resize" />
        </>
      )}
    </g>
  );
};

interface CanvasProps {
    canvasState: CanvasState;
    updateState: (updater: (prevState: CanvasState) => CanvasState, selection?: CanvasElement[]) => void;
    activeTool: Tool;
    selectedElements: CanvasElement[];
    setSelectedElements: React.Dispatch<React.SetStateAction<CanvasElement[]>>;
    getNextId: () => number;
    lineThickness: number;
    fontSize: number;
    moveSelectedElements: (dx: number, dy: number) => void;
    isGridVisible: boolean;
    onToolSelect: (tool: Tool) => void;
}

const getMidPoint = (touches: React.TouchList): Point => {
    return {
        x: (touches[0].clientX + touches[1].clientX) / 2,
        y: (touches[0].clientY + touches[1].clientY) / 2,
    };
};

const Canvas: React.FC<CanvasProps> = ({
    canvasState,
    updateState,
    activeTool,
    selectedElements,
    setSelectedElements,
    getNextId,
    lineThickness,
    fontSize,
    moveSelectedElements,
    isGridVisible,
    onToolSelect,
}) => {
    const { t } = useLanguage();
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [dragStartPoint, setDragStartPoint] = useState<Point | null>(null);
    const [isDrawingLine, setIsDrawingLine] = useState(false);
    const [lineStartPoint, setLineStartPoint] = useState<Point | null>(null);
    const [previewLine, setPreviewLine] = useState<GenogramLine | null>(null);
    const [rangeSelectionBox, setRangeSelectionBox] = useState<{ x: number, y: number, width: number, height: number } | null>(null);
    const [drawingStartPoint, setDrawingStartPoint] = useState<Point | null>(null);
    const [ghostShape, setGhostShape] = useState<GenogramShape | null>(null);
    const [editingTextId, setEditingTextId] = useState<number | null>(null);
    const [handleDrag, setHandleDrag] = useState<{ element: CanvasElement, handle: Handle } | null>(null);
    const lastClickRef = useRef({ time: 0, x: 0, y: 0 });
    const [isPanning, setIsPanning] = useState(false);
    const [lastPanPoint, setLastPanPoint] = useState<Point | null>(null);

    const getSVGPoint = useCallback((e: React.MouseEvent | MouseEvent | React.TouchEvent | TouchEvent): Point | null => {
        if (!svgRef.current) return null;

        let clientX, clientY;

        if ('touches' in e) {
            if (e.touches.length > 0) {
                clientX = e.touches[0].clientX;
                clientY = e.touches[0].clientY;
            } else if (e.changedTouches.length > 0) {
                clientX = e.changedTouches[0].clientX;
                clientY = e.changedTouches[0].clientY;
            } else {
                return null; // No touch points available
            }
        } else {
            clientX = e.clientX;
            clientY = e.clientY;
        }
        
        const pt = svgRef.current.createSVGPoint();
        pt.x = clientX;
        pt.y = clientY;
        const screenCTM = svgRef.current.getScreenCTM();
        if (!screenCTM) return null;
        return pt.matrixTransform(screenCTM.inverse());
    }, []);
    
    const getShapeCenterIfAtPoint = useCallback((point: Point): Point | null => {
        const result = getElementAtPosition(point.x, point.y, canvasState, []);
        if (result?.element.type === 'shape') {
            const shape = canvasState.shapes.find(s => s.id === result.element.id);
            return shape ? { x: shape.x, y: shape.y } : null;
        }
        return null;
    }, [canvasState]);

    const handleDoubleClick = (e: React.MouseEvent | React.TouchEvent, element: GenogramShape | GenogramText | GenogramBoundary) => {
        if ('stopPropagation' in e) e.stopPropagation();
        if ('fontSize' in element) { // This is GenogramText
            setEditingTextId(element.id);
        } else if ('label' in element) { // This is GenogramBoundary
            const newLabel = prompt(t('enterLabel', { current: element.label }), element.label) ?? element.label;
            updateState(prev => ({
                ...prev,
                boundaries: prev.boundaries.map(b => b.id === element.id ? { ...b, label: newLabel } : b),
            }));
        } else { // This is GenogramShape
            const newName = prompt(t('enterName', { current: element.text }), element.text) ?? element.text;
            const newAge = prompt(t('enterAge', { current: element.age }), element.age) ?? element.age;
            updateState(prev => ({
                ...prev,
                shapes: prev.shapes.map(s => s.id === element.id ? { ...s, text: newName, age: newAge } : s),
            }));
        }
    };
    
    const handleTextChange = (id: number, newText: string) => {
        updateState(prev => ({ ...prev, texts: prev.texts.map(t => t.id === id ? {...t, text: newText} : t) }), undefined);
    };

    const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const isTouchEvent = 'touches' in e;

        if (isTouchEvent && e.touches.length === 2) {
            // Cancel any single-touch actions
            setIsDragging(false);
            setDragStartPoint(null);
            setIsDrawingLine(false);
            setLineStartPoint(null);
            setPreviewLine(null);
            setDrawingStartPoint(null);
            setRangeSelectionBox(null);
            setHandleDrag(null);
            setGhostShape(null);

            // Start panning
            setIsPanning(true);
            setLastPanPoint(getMidPoint(e.touches));
            return;
        }
        
        if (editingTextId) return;
        const mousePoint = getSVGPoint(e);
        if (!mousePoint) return;

        // 消しゴムツールの場合は、クリックした要素を削除
        if (activeTool === 'erase') {
            const result = getElementAtPosition(mousePoint.x, mousePoint.y, canvasState, selectedElements);
            if (result) {
                const elementToDelete = result.element;
                updateState(prev => {
                    if (elementToDelete.type === 'shape') {
                        return { ...prev, shapes: prev.shapes.filter(s => s.id !== elementToDelete.id) };
                    } else if (elementToDelete.type === 'line') {
                        return { ...prev, lines: prev.lines.filter(l => l.id !== elementToDelete.id) };
                    } else if (elementToDelete.type === 'boundary') {
                        return { ...prev, boundaries: prev.boundaries.filter(b => b.id !== elementToDelete.id) };
                    } else if (elementToDelete.type === 'text') {
                        return { ...prev, texts: prev.texts.filter(t => t.id !== elementToDelete.id) };
                    }
                    return prev;
                }, []);
            }
            return;
        }

        const result = getElementAtPosition(mousePoint.x, mousePoint.y, canvasState, selectedElements);

        if (isTouchEvent && result && e.cancelable) {
            e.preventDefault();
        }
        
        if (result?.handle) {
            setHandleDrag({ element: result.element, handle: result.handle });
            setDragStartPoint(mousePoint);
            return;
        }

        if (Object.values(LineType).includes(activeTool as LineType)) {
            setIsDrawingLine(true);
            const startPoint = getShapeCenterIfAtPoint(mousePoint) || { x: snapToGrid(mousePoint.x), y: snapToGrid(mousePoint.y) };
            setLineStartPoint(startPoint);
            setPreviewLine({
                id: -1, type: activeTool as LineType, start: startPoint, end: startPoint, strokeWidth: lineThickness
            });
            return;
        }

        if (Object.values(ShapeType).includes(activeTool as ShapeType)) {
            const snappedPoint = { x: snapToGrid(mousePoint.x), y: snapToGrid(mousePoint.y) };
            const newShape: GenogramShape = {
                id: getNextId(), type: activeTool as ShapeType, x: snappedPoint.x, y: snappedPoint.y,
                width: SHAPE_SIZE, height: SHAPE_SIZE, text: '', age: '', isDeceased: false,
            };
            updateState(prev => ({ ...prev, shapes: [...prev.shapes, newShape] }), [{ type: 'shape', id: newShape.id }]);
            onToolSelect('select');
            return;
        }
        
        if (activeTool === 'cohabiting' || activeTool === 'text') {
            setDrawingStartPoint(mousePoint);
            return;
        }
        
        const clickedElement = result?.element;
        if (activeTool === 'select') {
            if (clickedElement) {
                const isShiftClick = 'shiftKey' in e && e.shiftKey;
                if (isShiftClick) {
                     setSelectedElements(prev => 
                        prev.some(el => el.id === clickedElement.id && el.type === clickedElement.type)
                        ? prev.filter(el => !(el.id === clickedElement.id && el.type === clickedElement.type))
                        : [...prev, clickedElement]
                    );
                } else {
                     if (!selectedElements.some(el => el.id === clickedElement.id && el.type === clickedElement.type)) {
                        setSelectedElements([clickedElement]);
                     }
                }
                setIsDragging(true);
            } else {
                setSelectedElements([]);
            }
            setDragStartPoint(mousePoint);
        } else {
             setDragStartPoint(mousePoint);
        }
    }, [activeTool, canvasState, getNextId, getSVGPoint, selectedElements, setSelectedElements, updateState, lineThickness, editingTextId, getShapeCenterIfAtPoint, onToolSelect]);

    const handleMouseMove = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        const isTouchEvent = 'touches' in e;

        // Handle two-finger panning on touch devices
        if (isTouchEvent && isPanning && e.touches.length === 2 && lastPanPoint && containerRef.current) {
            if (e.cancelable) e.preventDefault();
            const midPoint = getMidPoint(e.touches);
            const dx = midPoint.x - lastPanPoint.x;
            const dy = midPoint.y - lastPanPoint.y;
            containerRef.current.scrollLeft -= dx;
            containerRef.current.scrollTop -= dy;
            setLastPanPoint(midPoint);
            return; // Panning is exclusive, do nothing else
        }

        // Prevent default browser actions (like page scrolling) during canvas interactions.
        const isInteracting = isDrawingLine || handleDrag || drawingStartPoint || (dragStartPoint && (isDragging || activeTool === 'select'));
        if (isTouchEvent && isInteracting) {
            if (e.cancelable) e.preventDefault();
        }
        
        const mousePoint = getSVGPoint(e);
        if (!mousePoint) return;

        // Highest priority: dragging a resize handle
        if (handleDrag && dragStartPoint) {
            updateState(prev => {
                 const newLines = prev.lines.map(l => {
                    if (l.id === handleDrag.element.id) {
                        if (handleDrag.handle === 'line-start') {
                            const endPoint = l.end;
                            const snappedPoint = { x: snapToGrid(mousePoint.x), y: snapToGrid(mousePoint.y) };
                            const dx = Math.abs(snappedPoint.x - endPoint.x);
                            const dy = Math.abs(snappedPoint.y - endPoint.y);
                            const newStart = dx > dy ? { x: snappedPoint.x, y: endPoint.y } : { x: endPoint.x, y: snappedPoint.y };
                            return { ...l, start: newStart };
                        } else if (handleDrag.handle === 'line-end') {
                            const startPoint = l.start;
                             const snappedPoint = { x: snapToGrid(mousePoint.x), y: snapToGrid(mousePoint.y) };
                            const dx = Math.abs(snappedPoint.x - startPoint.x);
                            const dy = Math.abs(snappedPoint.y - startPoint.y);
                            const newEnd = dx > dy ? { x: snappedPoint.x, y: startPoint.y } : { x: startPoint.x, y: snappedPoint.y };
                            return { ...l, end: newEnd };
                        }
                    }
                    return l;
                });
                const newTexts = prev.texts.map(t => {
                   if (t.id === handleDrag.element.id && handleDrag.handle === 'text-resize-br') {
                       const newWidth = Math.max(GRID_SIZE, snapToGrid(mousePoint.x - t.x));
                       const newHeight = Math.max(GRID_SIZE, snapToGrid(mousePoint.y - t.y));
                       return { ...t, width: newWidth, height: newHeight };
                   }
                   return t;
                });
                const newBoundaries = prev.boundaries.map(b => {
                    if (b.id === handleDrag.element.id) {
                        let { x, y, width, height } = b;
                        const originalX2 = x + width;
                        const originalY2 = y + height;
                        const snappedX = snapToGrid(mousePoint.x);
                        const snappedY = snapToGrid(mousePoint.y);
                        
                        switch(handleDrag.handle) {
                            case 'top-left':
                                width = originalX2 - snappedX;
                                height = originalY2 - snappedY;
                                x = snappedX;
                                y = snappedY;
                                break;
                            case 'top-right':
                                width = snappedX - x;
                                height = originalY2 - snappedY;
                                y = snappedY;
                                break;
                            case 'bottom-left':
                                width = originalX2 - snappedX;
                                height = snappedY - y;
                                x = snappedX;
                                break;
                            case 'bottom-right':
                                width = snappedX - x;
                                height = snappedY - y;
                                break;
                            case 'top-center':
                                 height = originalY2 - snappedY;
                                 y = snappedY;
                                 break;
                            case 'bottom-center':
                                 height = snappedY - y;
                                 break;
                            case 'middle-left':
                                 width = originalX2 - snappedX;
                                 x = snappedX;
                                 break;
                            case 'middle-right':
                                 width = snappedX - x;
                                 break;
                        }

                        if (width < GRID_SIZE * 2) {
                            width = b.width;
                            x = b.x;
                        }
                        if (height < GRID_SIZE * 2) {
                            height = b.height;
                            y = b.y;
                        }
                        return { ...b, x, y, width, height };
                    }
                    return b;
                });
                return { ...prev, lines: newLines, texts: newTexts, boundaries: newBoundaries };
            }, selectedElements);
            return;
        }

        // Drawing a new line
        if (isDrawingLine && lineStartPoint) {
            const potentialEndPoint = getShapeCenterIfAtPoint(mousePoint) || { x: snapToGrid(mousePoint.x), y: snapToGrid(mousePoint.y) };
            const dx = Math.abs(potentialEndPoint.x - lineStartPoint.x);
            const dy = Math.abs(potentialEndPoint.y - lineStartPoint.y);
            const endPoint = dx > dy
                ? { x: potentialEndPoint.x, y: lineStartPoint.y }
                : { x: lineStartPoint.x, y: potentialEndPoint.y };
            setPreviewLine(prev => prev ? { ...prev, end: endPoint } : null);
            return;
        }

        // Moving selected elements
        if (isDragging && dragStartPoint && selectedElements.length > 0) {
            const dx = mousePoint.x - dragStartPoint.x;
            const dy = mousePoint.y - dragStartPoint.y;
            moveSelectedElements(dx, dy);
            setDragStartPoint(mousePoint);
            return;
        }

        // Drawing a boundary, text box, or range selection box
        if (drawingStartPoint || (dragStartPoint && activeTool === 'select')) {
            const start = drawingStartPoint || dragStartPoint;
            if (start) {
                const x = Math.min(start.x, mousePoint.x);
                const y = Math.min(start.y, mousePoint.y);
                const width = Math.abs(start.x - mousePoint.x);
                const height = Math.abs(start.y - mousePoint.y);
                setRangeSelectionBox({ x, y, width, height });
            }
            return;
        }

        // If no other action, show ghost shape for shape tools
        const isShapeToolActive = Object.values(ShapeType).includes(activeTool as ShapeType);
        if (isShapeToolActive) {
            const snappedX = snapToGrid(mousePoint.x);
            const snappedY = snapToGrid(mousePoint.y);
            if (!ghostShape || ghostShape.x !== snappedX || ghostShape.y !== snappedY) {
                setGhostShape({
                    id: -1, type: activeTool as ShapeType, x: snappedX, y: snappedY,
                    width: SHAPE_SIZE, height: SHAPE_SIZE, text: '', age: '', isDeceased: false,
                });
            }
        } else if (ghostShape) {
            // Clear ghost shape if tool is no longer a shape tool
            setGhostShape(null);
        }
    }, [
        activeTool,
        dragStartPoint,
        isDrawingLine,
        lineStartPoint,
        getSVGPoint,
        isDragging,
        selectedElements,
        updateState,
        ghostShape,
        drawingStartPoint,
        moveSelectedElements,
        handleDrag,
        getShapeCenterIfAtPoint,
        isPanning,
        lastPanPoint
    ]);

    const handleMouseUp = useCallback((e: React.MouseEvent | React.TouchEvent) => {
        if (isPanning) {
            setIsPanning(false);
            setLastPanPoint(null);
            return;
        }
        
        const mousePoint = getSVGPoint(e);
        
        if (editingTextId && mousePoint) {
            const result = getElementAtPosition(mousePoint.x, mousePoint.y, canvasState, selectedElements);
            if (!result || result.element.type !== 'text' || result.element.id !== editingTextId) {
                setEditingTextId(null);
            }
        }
        
        // Handle double-click/tap for editing
        let wasDoubleClick = false;
        if (mousePoint) {
            const now = Date.now();
            const timeDiff = now - lastClickRef.current.time;
            const distDiff = Math.hypot(mousePoint.x - lastClickRef.current.x, mousePoint.y - lastClickRef.current.y);
            
            if (timeDiff < 400 && distDiff < 10) { // It's a double-tap
                wasDoubleClick = true;
                const result = getElementAtPosition(mousePoint.x, mousePoint.y, canvasState, []);
                if (result?.element && !result.handle) {
                    const element = result.element.type === 'shape' ? canvasState.shapes.find(s=>s.id === result.element.id) : 
                                    result.element.type === 'text' ? canvasState.texts.find(t=>t.id === result.element.id) : 
                                    canvasState.boundaries.find(b=>b.id === result.element.id);
                    if(element) handleDoubleClick(e, element);
                }
                lastClickRef.current = { time: 0, x: 0, y: 0 }; // Reset after double-tap
            } else {
                lastClickRef.current = { time: now, x: mousePoint.x, y: mousePoint.y }; // Record for next tap
            }
        }


        // TAP/CLICK ACTION FOR MODIFIER TOOLS
        if (!wasDoubleClick && dragStartPoint && mousePoint) {
            const dx = mousePoint.x - dragStartPoint.x;
            const dy = mousePoint.y - dragStartPoint.y;
            if (Math.hypot(dx, dy) < 5) { // It's a tap/click
                const result = getElementAtPosition(mousePoint.x, mousePoint.y, canvasState, []);
                if (result?.element && !result.handle) {
                    const clicked = result.element;
                    let handled = false;
                    if (activeTool === 'deceased' && clicked.type === 'shape') {
                        updateState(prev => ({ ...prev, shapes: prev.shapes.map(s => s.id === clicked.id ? { ...s, isDeceased: !s.isDeceased } : s) }));
                        handled = true;
                    } else if ((activeTool === 'separation' || activeTool === 'divorce') && clicked.type === 'line') {
                        updateState(prev => ({ ...prev, lines: prev.lines.map(l => l.id === clicked.id ? { ...l, decoration: l.decoration === activeTool ? null : activeTool as LineDecoration } : l) }));
                        handled = true;
                    } else if (activeTool === 'boundary' && clicked.type === 'shape') {
                        updateState(prev => ({ ...prev, shapes: prev.shapes.map(s => s.id === clicked.id ? { ...s, isCohabitingWithIndex: !s.isCohabitingWithIndex } : s) }));
                        handled = true;
                    }
                    
                    if (handled) {
                        onToolSelect('select');
                    }
                }
            }
        }
        
        if (isDrawingLine && lineStartPoint && previewLine && mousePoint) {
            const potentialEndPoint = getShapeCenterIfAtPoint(mousePoint) || { x: snapToGrid(mousePoint.x), y: snapToGrid(mousePoint.y) };
            const dx = Math.abs(potentialEndPoint.x - lineStartPoint.x);
            const dy = Math.abs(potentialEndPoint.y - lineStartPoint.y);
            const endPoint = dx > dy
                ? { x: potentialEndPoint.x, y: lineStartPoint.y }
                : { x: lineStartPoint.x, y: potentialEndPoint.y };

            if (lineStartPoint.x !== endPoint.x || lineStartPoint.y !== endPoint.y) {
                 const newLine: GenogramLine = {
                    id: getNextId(), type: activeTool as LineType, start: lineStartPoint, end: endPoint,
                    strokeWidth: lineThickness, decoration: null,
                };
                updateState(prev => ({ ...prev, lines: [...prev.lines, newLine] }));
            }
        }
        
        if (rangeSelectionBox && drawingStartPoint) {
             if (activeTool === 'cohabiting') {
                const newBoundary: GenogramBoundary = {
                    id: getNextId(), x: snapToGrid(rangeSelectionBox.x), y: snapToGrid(rangeSelectionBox.y),
                    width: snapToGrid(rangeSelectionBox.width), height: snapToGrid(rangeSelectionBox.height), label: '',
                };
                if(newBoundary.width > GRID_SIZE && newBoundary.height > GRID_SIZE) {
                    updateState(prev => ({ ...prev, boundaries: [...prev.boundaries, newBoundary] }));
                    onToolSelect('select');
                }
            } else if(activeTool === 'text') {
                 const newText: GenogramText = {
                    id: getNextId(), x: snapToGrid(rangeSelectionBox.x), y: snapToGrid(rangeSelectionBox.y),
                    width: snapToGrid(rangeSelectionBox.width) || GRID_SIZE * 4, height: snapToGrid(rangeSelectionBox.height) || GRID_SIZE * 2,
                    text: t('enterText'), fontSize
                 };
                 updateState(prev => ({ ...prev, texts: [...prev.texts, newText] }), [{type: 'text', id: newText.id}]);
                 setEditingTextId(newText.id);
                 onToolSelect('select');
            }
        }

        if (rangeSelectionBox && dragStartPoint && !isDragging && (activeTool === 'select' && !handleDrag)) {
            const { x, y, width, height } = rangeSelectionBox;
            const elementsInBox: CanvasElement[] = [];
            const selBox = { x1: x, y1: y, x2: x + width, y2: y + height };

            canvasState.shapes.forEach(s => { if (s.x >= selBox.x1 && s.x <= selBox.x2 && s.y >= selBox.y1 && s.y <= selBox.y2) elementsInBox.push({ type: 'shape', id: s.id }); });
            canvasState.lines.forEach(l => {
                const startIn = l.start.x >= selBox.x1 && l.start.x <= selBox.x2 && l.start.y >= selBox.y1 && l.start.y <= selBox.y2;
                const endIn = l.end.x >= selBox.x1 && l.end.x <= selBox.x2 && l.end.y >= selBox.y1 && l.end.y <= selBox.y2;
                if (startIn && endIn) elementsInBox.push({ type: 'line', id: l.id });
            });
            canvasState.boundaries.forEach(b => {
                const bBox = { x1: b.x, y1: b.y, x2: b.x + b.width, y2: b.y + b.height };
                if (selBox.x1 < bBox.x2 && bBox.x1 < selBox.x2 && selBox.y1 < bBox.y2 && bBox.y1 < selBox.y2) elementsInBox.push({ type: 'boundary', id: b.id });
            });
            canvasState.texts.forEach(t => {
                const tBox = { x1: t.x, y1: t.y, x2: t.x + t.width, y2: t.y + t.height };
                if (selBox.x1 < tBox.x2 && tBox.x1 < selBox.x2 && selBox.y1 < tBox.y2 && tBox.y1 < selBox.y2) elementsInBox.push({ type: 'text', id: t.id });
            });
            setSelectedElements(elementsInBox);
        }

        setIsDragging(false);
        setDragStartPoint(null);
        setIsDrawingLine(false);
        setLineStartPoint(null);
        setPreviewLine(null);
        setDrawingStartPoint(null);
        setRangeSelectionBox(null);
        setHandleDrag(null);
    }, [isPanning, activeTool, canvasState, getNextId, getSVGPoint, lineThickness, rangeSelectionBox, t, updateState, drawingStartPoint, isDrawingLine, lineStartPoint, previewLine, dragStartPoint, isDragging, setSelectedElements, selectedElements, fontSize, editingTextId, handleDrag, getShapeCenterIfAtPoint, onToolSelect]);

    const handleMouseLeave = useCallback(() => {
        setIsDragging(false);
        setDragStartPoint(null);
        setIsDrawingLine(false);
        setLineStartPoint(null);
        setPreviewLine(null);
        setDrawingStartPoint(null);
        setRangeSelectionBox(null);
        setGhostShape(null);
        setHandleDrag(null);
        setIsPanning(false);
        setLastPanPoint(null);
    }, []);
    
    const GridLines = React.memo(() => (
        <g id="grid-group">
            <defs>
                <pattern id="grid" width={GRID_SIZE} height={GRID_SIZE} patternUnits="userSpaceOnUse">
                    <path d={`M ${GRID_SIZE} 0 L 0 0 0 ${GRID_SIZE}`} fill="none" stroke="#c0c0c0" strokeWidth="0.5" />
                </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" pointerEvents="none" />
        </g>
    ));

    const getCursorStyle = () => {
        if (handleDrag) return 'move'; // The cursor style is set on the handle itself
        const tool = activeTool;
        if (tool === 'erase') {
            return 'pointer';
        }
        if (Object.values(LineType).includes(tool as LineType) || tool === 'cohabiting' || Object.values(ShapeType).includes(tool as ShapeType) || isDrawingLine || tool === 'text') {
            return 'crosshair';
        }
        if (tool === 'deceased' || tool === 'separation' || tool === 'divorce' || tool === 'boundary') {
            return 'pointer';
        }
        return 'default';
    };

    return (
        <div ref={containerRef} className="w-full h-full bg-white rounded-lg shadow-inner overflow-auto relative" onMouseLeave={handleMouseLeave} onTouchCancel={handleMouseLeave}>
            <svg
                id={SVG_CANVAS_ID}
                ref={svgRef}
                width={CANVAS_WIDTH}
                height={CANVAS_HEIGHT}
                style={{ cursor: getCursorStyle() }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onTouchStart={handleMouseDown}
                onTouchMove={handleMouseMove}
                onTouchEnd={handleMouseUp}
            >
                {isGridVisible && <GridLines />}
                <g id="canvas-content">
                    {canvasState.boundaries.map(b => <BoundaryComponent key={b.id} boundary={b} isSelected={selectedElements.some(el => el.type === 'boundary' && el.id === b.id)} />)}
                    {canvasState.lines.map(l => <LineComponent key={l.id} line={l} isSelected={selectedElements.some(el => el.type === 'line' && el.id === l.id)} />)}
                    {canvasState.shapes.map(s => <ShapeComponent key={s.id} shape={s} isSelected={selectedElements.some(el => el.type === 'shape' && el.id === s.id)} />)}
                    {canvasState.texts.map(t => (
                        <TextComponent
                            key={t.id}
                            text={t}
                            isSelected={selectedElements.some(el => el.type === 'text' && el.id === t.id)}
                            isEditing={editingTextId === t.id}
                            onTextChange={handleTextChange}
                        />
                    ))}
                </g>
                
                {ghostShape && (
                    <g opacity="0.4" style={{ pointerEvents: 'none' }}>
                        <ShapeComponent shape={ghostShape} isSelected={false} />
                    </g>
                )}
                
                {previewLine && <LineComponent line={previewLine} isSelected={false} />}
                {rangeSelectionBox && <rect {...rangeSelectionBox} fill="rgba(79, 70, 229, 0.1)" stroke="rgba(79, 70, 229, 0.5)" strokeWidth="1" />}
            </svg>
        </div>
    );
};

export default Canvas;