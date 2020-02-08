import * as THREE from 'three';

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
