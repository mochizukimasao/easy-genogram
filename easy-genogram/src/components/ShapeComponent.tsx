
import React from 'react';
import { GenogramShape, ShapeType } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

const ShapeComponent: React.FC<{ 
  shape: GenogramShape; 
  isSelected: boolean; 
}> = ({ shape, isSelected }) => {
  const { t } = useLanguage();
  const { x, y, width, height, isDeceased, type, age, text, isCohabitingWithIndex } = shape;
  const halfW = width / 2;
  const halfH = height / 2;
  const innerW = width * 0.8;
  const innerH = height * 0.8;
  const innerHalfW = innerW / 2;
  const innerHalfH = innerH / 2;

  let shapeElement;
  switch (type) {
    case ShapeType.Male:
      shapeElement = <rect x={-halfW} y={-halfH} width={width} height={height} rx="2" ry="2" fill="#f9f9f9" stroke="black" strokeWidth="2" />;
      break;
    case ShapeType.Female:
      shapeElement = <circle cx="0" cy="0" r={halfW} fill="#f9f9f9" stroke="black" strokeWidth="2" />;
      break;
    case ShapeType.IndexMale:
      shapeElement = (
        <g>
          <rect x={-halfW} y={-halfH} width={width} height={height} rx="2" ry="2" fill="#f9f9f9" stroke="black" strokeWidth="2" />
          <rect x={-innerHalfW} y={-innerHalfH} width={innerW} height={innerH} rx="1" ry="1" stroke="black" strokeWidth="1.5" fill="none" />
        </g>
      );
      break;
    case ShapeType.IndexFemale:
      shapeElement = (
        <g>
          <circle cx="0" cy="0" r={halfW} fill="#f9f9f9" stroke="black" strokeWidth="2" />
          <circle cx="0" cy="0" r={halfW * 0.7} stroke="black" strokeWidth="1.5" fill="none" />
        </g>
      );
      break;
  }
  
  const hasName = !!text;
  const hasAge = !!age;

  let extraHeight = 0;
  if (hasName) extraHeight += 18;
  if (isCohabitingWithIndex) extraHeight += 14;

  return (
    <g transform={`translate(${x}, ${y})`}>
      {shapeElement}
      
      {hasAge && (
        <text
          y={2}
          textAnchor="middle"
          fontSize="18px"
          fontWeight="bold"
          fill="#333"
          dominantBaseline="middle"
          style={{pointerEvents: 'none'}}
        >
          {age}
        </text>
      )}

      {hasName && (
        <text
            y={halfH + 16}
            textAnchor="middle"
            fontSize="14px"
            fill="#333"
            dominantBaseline="baseline"
            style={{pointerEvents: 'none'}}
            stroke="#ffffff"
            strokeWidth="4px"
            strokeLinejoin="round"
            paintOrder="stroke"
        >
            {text}
        </text>
      )}

      {isDeceased && (
        <g stroke="black" strokeWidth="2.5">
          <line x1={-halfW * 0.8} y1={-halfH * 0.8} x2={halfW * 0.8} y2={halfH * 0.8} />
          <line x1={-halfW * 0.8} y1={halfH * 0.8} x2={halfW * 0.8} y2={-halfH * 0.8} />
        </g>
      )}
      
      {isCohabitingWithIndex && (
        <text 
            y={halfH + 16 + (hasName ? 16 : 0)} 
            textAnchor="middle" 
            fontSize="12px" 
            fill="black"
            stroke="#ffffff"
            strokeWidth="4px"
            strokeLinejoin="round"
            paintOrder="stroke"
            dominantBaseline="baseline"
        >
          ({t('cohabitingCaption')})
        </text>
      )}
      {isSelected && <rect x={-halfW - 4} y={-halfH - 4} width={width + 8} height={height + 8 + extraHeight} fill="none" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4 4" style={{pointerEvents: 'none'}} />}
    </g>
  );
};

export default ShapeComponent;