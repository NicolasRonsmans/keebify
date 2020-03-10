import * as THREE from 'three';

export type KeyProfile = 'CHERRY_MX' | 'SA';
export type KeysProfile = {
  [key: string]: {
    PATH: string;
    SIZES: { key: string; value: number }[];
    ROWS: string[];
  };
};

export type KeysLibrary = {
  [key: string]: {
    [key: string]: THREE.BufferGeometry;
  };
};

export type LayoutKey =
  | string
  | {
      a?: number;
      h?: number;
      c?: string;
      t?: string;
      w?: number;
    };
