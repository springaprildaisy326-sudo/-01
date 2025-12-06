export enum TreeState {
  SCATTERED = 'SCATTERED',
  TREE_SHAPE = 'TREE_SHAPE'
}

export interface PositionData {
  x: number;
  y: number;
  z: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  scale: number;
  color?: string; // Optional specific color for this particle
}

export interface TargetPositions {
  tree: PositionData;
  scatter: PositionData;
}