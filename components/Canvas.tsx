
import React, { useState, useEffect, useRef } from 'react';
import {
  GenogramShape,
  GenogramLine,
  Tool,
  CanvasElement,
  ShapeType,
  GenogramBoundary,
  CanvasState,
  GenogramText,
} from '../types';
import { GRID_SIZE, SHAPE_SIZE } from '../constants';
import ShapeComponent from './ShapeComponent';
import LineComponent from './LineComponent';
import BoundaryComponent from './BoundaryComponent';
import TextComponent from './TextComponent';
import { useLanguage } from '../contexts/LanguageContext';

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
  showInitialShapeAlert: boolean; // New prop
  setShowInitialShapeAlert: React.Dispatch<React.SetStateAction<boolean>>; // New prop
}

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
  showInitialShapeAlert,
  setShowInitialShapeAlert,
}) => {
  const { t } = useLanguage();
  const svgRef = useRef<SVGSVGElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [currentTransform, setCurrentTransform] = useState({ x: 0, y: 0, scale: 1 });
  const [isDrawingLine, setIsDrawingLine] = useState(false);
  const [currentLine, setCurrentLine] = useState<GenogramLine | null>(null);
  const [isDrawingBoundary, setIsDrawingBoundary] = useState(false);
  const [currentBoundary, setCurrentBoundary] = useState<GenogramBoundary | null>(null);
  const [isDrawingText, setIsDrawingText] = useState(false);
  const [currentText, setCurrentText] = useState<GenogramText | null>(null);

  const lastTap = useRef(0);

  const getSVGPoint = useCallback((clientX: number, clientY: number) => {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    let pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    return pt.matrixTransform(svg.getScreenCTM()?.inverse());
  }, []);

  const snapToGrid = useCallback((value: number) => {
    return Math.round(value / GRID_SIZE) * GRID_SIZE;
  }, []);

  const handleMouseDown = useCallback((event: React.MouseEvent<SVGElement>) => {
    const { clientX, clientY } = event;
    const svgPoint = getSVGPoint(clientX, clientY);

    if (activeTool === 'select') {
      const target = event.target as SVGElement;
      const isShape = target.closest('.genogram-shape');
      const isLine = target.closest('.genogram-line');
      const isBoundary = target.closest('.genogram-boundary');
      const isText = target.closest('.genogram-text');

      if (isShape || isLine || isBoundary || isText) {
        // Element selection logic
        let newSelectedElements: CanvasElement[] = [];
        if (isShape) newSelectedElements.push({ type: 'shape', id: parseInt(isShape.id) });
        if (isLine) newSelectedElements.push({ type: 'line', id: parseInt(isLine.id) });
        if (isBoundary) newSelectedElements.push({ type: 'boundary', id: parseInt(isBoundary.id) });
        if (isText) newSelectedElements.push({ type: 'text', id: parseInt(isText.id) });

        if (event.shiftKey) {
          setSelectedElements(prev => {
            const existingIds = new Set(prev.map(el => `${el.type}-${el.id}`));
            const newElementsToAdd = newSelectedElements.filter(el => !existingIds.has(`${el.type}-${el.id}`));
            return [...prev, ...newElementsToAdd];
          });
        } else {
          setSelectedElements(newSelectedElements);
        }
        setIsDragging(true);
        setDragStart({ x: svgPoint.x, y: svgPoint.y });
      } else {
        setSelectedElements([]);
        setIsDragging(true);
        setDragStart({ x: svgPoint.x, y: svgPoint.y });
      }
    } else if (activeTool === 'line_solid' || activeTool === 'line_dashed') {
      setIsDrawingLine(true);
      setCurrentLine({
        id: getNextId(),
        type: activeTool,
        start: { x: snapToGrid(svgPoint.x), y: snapToGrid(svgPoint.y) },
        end: { x: snapToGrid(svgPoint.x), y: snapToGrid(svgPoint.y) },
        strokeWidth: lineThickness,
      });
    } else if (activeTool === 'boundary') {
      setIsDrawingBoundary(true);
      setCurrentBoundary({
        id: getNextId(),
        x: snapToGrid(svgPoint.x),
        y: snapToGrid(svgPoint.y),
        width: 0,
        height: 0,
        label: '',
      });
    } else if (activeTool === 'text') {
      setIsDrawingText(true);
      setCurrentText({
        id: getNextId(),
        x: snapToGrid(svgPoint.x),
        y: snapToGrid(svgPoint.y),
        width: 0,
        height: 0,
        text: '',
        fontSize: fontSize,
      });
    } else if (activeTool.startsWith('shape_')) {
      const newShape: GenogramShape = {
        id: getNextId(),
        type: activeTool as ShapeType,
        x: snapToGrid(svgPoint.x),
        y: snapToGrid(svgPoint.y),
        width: SHAPE_SIZE,
        height: SHAPE_SIZE,
        text: '',
        age: '',
        isDeceased: false,
      };
      updateState(prev => ({ ...prev, shapes: [...prev.shapes, newShape] }), [{ type: 'shape', id: newShape.id }]);
      onToolSelect('select');

      // Only show alert if it's the first shape placed and not suppressed
      if (showInitialShapeAlert) {
        const name = prompt(t('enterName', { current: newShape.text }));
        const age = prompt(t('enterAge', { current: newShape.age }));
        updateState(prev => ({
          ...prev,
          shapes: prev.shapes.map(s =>
            s.id === newShape.id ? { ...s, text: name || s.text, age: age || s.age } : s
          ),
        }));
        // setShowInitialShapeAlert(false); // Suppress subsequent alerts
      }

    }
  }, [activeTool, getNextId, getSVGPoint, lineThickness, fontSize, snapToGrid, updateState, selectedElements, onToolSelect, showInitialShapeAlert, setShowInitialShapeAlert, t]);

  const handleMouseMove = useCallback((event: React.MouseEvent<SVGElement>) => {
    if (!isDragging && !isDrawingLine && !isDrawingBoundary && !isDrawingText) return;

    const { clientX, clientY } = event;
    const svgPoint = getSVGPoint(clientX, clientY);

    if (isDragging && selectedElements.length > 0) {
      const dx = snapToGrid(svgPoint.x - dragStart.x);
      const dy = snapToGrid(svgPoint.y - dragStart.y);
      if (dx !== 0 || dy !== 0) {
        moveSelectedElements(dx, dy);
        setDragStart({ x: svgPoint.x, y: svgPoint.y });
      }
    } else if (isDrawingLine && currentLine) {
      setCurrentLine(prev => prev ? { ...prev, end: { x: snapToGrid(svgPoint.x), y: snapToGrid(svgPoint.y) } } : null);
    } else if (isDrawingBoundary && currentBoundary) {
      setCurrentBoundary(prev => prev ? {
        ...prev,
        width: snapToGrid(svgPoint.x - prev.x),
        height: snapToGrid(svgPoint.y - prev.y),
      } : null);
    } else if (isDrawingText && currentText) {
      setCurrentText(prev => prev ? {
        ...prev,
        width: snapToGrid(svgPoint.x - prev.x),
        height: snapToGrid(svgPoint.y - prev.y),
      } : null);
    }
  }, [isDragging, isDrawingLine, isDrawingBoundary, isDrawingText, getSVGPoint, dragStart, selectedElements, moveSelectedElements, currentLine, currentBoundary, currentText, snapToGrid]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    if (isDrawingLine && currentLine) {
      updateState(prev => ({ ...prev, lines: [...prev.lines, currentLine] }));
      setCurrentLine(null);
      setIsDrawingLine(false);
      onToolSelect('select');
    } else if (isDrawingBoundary && currentBoundary) {
      const label = prompt(t('enterLabel', { current: currentBoundary.label }));
      updateState(prev => ({ ...prev, boundaries: [...prev.boundaries, { ...currentBoundary, label: label || currentBoundary.label }] }));
      setCurrentBoundary(null);
      setIsDrawingBoundary(false);
      onToolSelect('select');
    } else if (isDrawingText && currentText) {
      const textContent = prompt(t('enterText'));
      updateState(prev => ({ ...prev, texts: [...prev.texts, { ...currentText, text: textContent || currentText.text }] }));
      setCurrentText(null);
      setIsDrawingText(false);
      onToolSelect('select');
    }
  }, [isDrawingLine, currentLine, isDrawingBoundary, currentBoundary, isDrawingText, currentText, updateState, onToolSelect, t]);

  const handleDoubleClick = useCallback((event: React.MouseEvent<SVGElement>) => {
    const target = event.target as SVGElement;
    const isShape = target.closest('.genogram-shape');
    const isText = target.closest('.genogram-text');
    const isBoundary = target.closest('.genogram-boundary');

    if (isShape) {
      const shapeId = parseInt(isShape.id);
      const shapeToEdit = canvasState.shapes.find(s => s.id === shapeId);
      if (shapeToEdit) {
        const newName = prompt(t('enterName', { current: shapeToEdit.text }), shapeToEdit.text);
        const newAge = prompt(t('enterAge', { current: shapeToEdit.age }), shapeToEdit.age);
        updateState(prev => ({
          ...prev,
          shapes: prev.shapes.map(s =>
            s.id === shapeId ? { ...s, text: newName || s.text, age: newAge || s.age } : s
          ),
        }));
      }
    } else if (isText) {
      const textId = parseInt(isText.id);
      const textToEdit = canvasState.texts.find(t => t.id === textId);
      if (textToEdit) {
        const newText = prompt(t('enterText'), textToEdit.text);
        updateState(prev => ({
          ...prev,
          texts: prev.texts.map(t =>
            t.id === textId ? { ...t, text: newText || t.text } : t
          ),
        }));
      }
    } else if (isBoundary) {
      const boundaryId = parseInt(isBoundary.id);
      const boundaryToEdit = canvasState.boundaries.find(b => b.id === boundaryId);
      if (boundaryToEdit) {
        const newLabel = prompt(t('enterLabel', { current: boundaryToEdit.label }), boundaryToEdit.label);
        updateState(prev => ({
          ...prev,
          boundaries: prev.boundaries.map(b =>
            b.id === boundaryId ? { ...b, label: newLabel || b.label } : b
          ),
        }));
      }
    }
  }, [canvasState.shapes, canvasState.texts, canvasState.boundaries, updateState, t]);

  const handleTouchStart = useCallback((event: React.TouchEvent<SVGElement>) => {
    const now = new Date().getTime();
    const timesSinceLastTap = now - lastTap.current;
    if (timesSinceLastTap < 300 && timesSinceLastTap > 0) { // Double tap detected
      event.preventDefault();
      const touch = event.touches[0];
      const svgPoint = getSVGPoint(touch.clientX, touch.clientY);
      const target = document.elementFromPoint(touch.clientX, touch.clientY) as SVGElement;
      
      // Simulate double click for shapes, text, and boundaries
      const isShape = target.closest('.genogram-shape');
      const isText = target.closest('.genogram-text');
      const isBoundary = target.closest('.genogram-boundary');

      if (isShape) {
        const shapeId = parseInt(isShape.id);
        const shapeToEdit = canvasState.shapes.find(s => s.id === shapeId);
        if (shapeToEdit) {
          const newName = prompt(t('enterName', { current: shapeToEdit.text }), shapeToEdit.text);
          const newAge = prompt(t('enterAge', { current: shapeToEdit.age }), shapeToEdit.age);
          updateState(prev => ({
            ...prev,
            shapes: prev.shapes.map(s =>
              s.id === shapeId ? { ...s, text: newName || s.text, age: newAge || s.age } : s
            ),
          }));
        }
      } else if (isText) {
        const textId = parseInt(isText.id);
        const textToEdit = canvasState.texts.find(t => t.id === textId);
        if (textToEdit) {
          const newText = prompt(t('enterText'), textToEdit.text);
          updateState(prev => ({
            ...prev,
            texts: prev.texts.map(t =>
              t.id === textId ? { ...t, text: newText || t.text } : t
            ),
          }));
        }
      } else if (isBoundary) {
        const boundaryId = parseInt(isBoundary.id);
        const boundaryToEdit = canvasState.boundaries.find(b => b.id === boundaryId);
        if (boundaryToEdit) {
          const newLabel = prompt(t('enterLabel', { current: boundaryToEdit.label }), boundaryToEdit.label);
          updateState(prev => ({
            ...prev,
            boundaries: prev.boundaries.map(b =>
              b.id === boundaryId ? { ...b, label: newLabel || b.label } : b
            ),
          }));
        }
      }

      lastTap.current = 0; // Reset for next tap
    } else {
      lastTap.current = now;
      // Handle single tap / initial touch for drag/draw
      handleMouseDown(event as unknown as React.MouseEvent<SVGElement>);
    }
  }, [getSVGPoint, handleMouseDown, canvasState.shapes, canvasState.texts, canvasState.boundaries, updateState, t]);

  const handleTouchMove = useCallback((event: React.TouchEvent<SVGElement>) => {
    handleMouseMove(event as unknown as React.MouseEvent<SVGElement>);
  }, [handleMouseMove]);

  const handleTouchEnd = useCallback((event: React.TouchEvent<SVGElement>) => {
    handleMouseUp(event as unknown as React.MouseEvent<SVGElement>);
  }, [handleMouseUp]);

  return (
    <svg
      id="svg-canvas"
      ref={svgRef}
      className="w-full h-full bg-gray-100 touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp} // End drag/draw if mouse leaves canvas
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onDoubleClick={handleDoubleClick}
    >
      {isGridVisible && (
        <g id="grid-group" stroke="#e0e0e0" strokeWidth="1">
          {Array.from({ length: 2000 / GRID_SIZE }).map((_, i) => (
            <line key={`h-${i}`} x1="0" y1={i * GRID_SIZE} x2="2000" y2={i * GRID_SIZE} />
          ))}
          {Array.from({ length: 2000 / GRID_SIZE }).map((_, i) => (
            <line key={`v-${i}`} x1={i * GRID_SIZE} y1="0" x2={i * GRID_SIZE} y2="2000" />
          ))}
        </g>
      )}

      {canvasState.boundaries.map((boundary) => (
        <BoundaryComponent
          key={boundary.id}
          boundary={boundary}
          isSelected={selectedElements.some(el => el.type === 'boundary' && el.id === boundary.id)}
        />
      ))}

      {canvasState.lines.map((line) => (
        <LineComponent
          key={line.id}
          line={line}
          isSelected={selectedElements.some(el => el.type === 'line' && el.id === line.id)}
        />
      ))}

      {canvasState.shapes.map((shape) => (
        <ShapeComponent
          key={shape.id}
          shape={shape}
          isSelected={selectedElements.some(el => el.type === 'shape' && el.id === shape.id)}
        />
      ))}

      {canvasState.texts.map((text) => (
        <TextComponent
          key={text.id}
          text={text}
          isSelected={selectedElements.some(el => el.type === 'text' && el.id === text.id)}
        />
      ))}

      {isDrawingLine && currentLine && (
        <LineComponent line={currentLine} isSelected={false} />
      )}
      {isDrawingBoundary && currentBoundary && (
        <BoundaryComponent boundary={currentBoundary} isSelected={false} />
      )}
      {isDrawingText && currentText && (
        <TextComponent text={currentText} isSelected={false} />
      )}
    </svg>
  );
};

export default Canvas;
