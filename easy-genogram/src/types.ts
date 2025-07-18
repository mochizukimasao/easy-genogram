export enum ShapeType {
  Male = 'male',
  Female = 'female',
  IndexMale = 'index_male',
  IndexFemale = 'index_female',
}

export enum LineType {
  Solid = 'solid',
  Dashed = 'dashed',
}

export type LineDecoration = 'separation' | 'divorce';

export type Tool = 
  | 'select' 
  | 'deceased' 
  | 'boundary' 
  | 'separation'
  | 'divorce'
  | 'cohabiting'
  | 'text'
  | ShapeType 
  | LineType;

export type Handle = 
  | 'top-left' | 'top-center' | 'top-right' 
  | 'middle-left' | 'middle-right' 
  | 'bottom-left' | 'bottom-center' | 'bottom-right'
  | 'line-start' | 'line-end'
  | 'text-resize-br';

export interface Point {
  x: number;
  y: number;
}

export interface GenogramShape {
  id: number;
  type: ShapeType;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string; // name
  age: string;
  isDeceased: boolean;
  isCohabitingWithIndex?: boolean;
}

export interface GenogramLine {
  id: number;
  type: LineType;
  start: Point;
  end: Point;
  strokeWidth: number;
  decoration?: LineDecoration | null;
}

export interface GenogramBoundary {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
}

export interface GenogramText {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    fontSize: number;
}

export interface CanvasState {
    shapes: GenogramShape[];
    lines: GenogramLine[];
    boundaries: GenogramBoundary[];
    texts: GenogramText[];
}

export type CanvasElement = 
  | { type: 'shape'; id: number }
  | { type: 'line'; id: number }
  | { type: 'boundary'; id: number }
  | { type: 'text'; id: number };