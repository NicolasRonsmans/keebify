import * as THREE from 'three';

import { KEYS } from '../../constants';

function createKeyprint(
  text: string,
  size: number,
  rowType: string,
  color: string
) {
  const { width, height } = (() => {
    let width, height;

    switch (size) {
      case 1.25:
        width = KEYS.CHERRY_MX.SIZES[1].value;
        break;
      case 1.5:
        width = KEYS.CHERRY_MX.SIZES[2].value;
        break;
      case 1.75:
        width = KEYS.CHERRY_MX.SIZES[3].value;
        break;
      case 2:
        width = KEYS.CHERRY_MX.SIZES[4].value;
        break;
      case 2.25:
        width = KEYS.CHERRY_MX.SIZES[5].value;
        break;
      case 2.5:
        width = KEYS.CHERRY_MX.SIZES[6].value;
        break;
      case 2.75:
        width = KEYS.CHERRY_MX.SIZES[7].value;
        break;
      case 6.25:
        width = KEYS.CHERRY_MX.SIZES[8].value;
        break;
      case 1:
      default:
        width = KEYS.CHERRY_MX.SIZES[0].value;
    }

    switch (rowType) {
      case '1':
        height = 14;
        break;
      case '2':
        height = 14.1;
        break;
      case '3':
        height = 14;
        break;
      case '4':
        height = 14;
        break;
      default:
        height = 14;
    }

    return { width, height };
  })();
  const factor = 12;
  const padding = 1.1 * factor;
  const ctx = document
    .createElement('canvas')
    .getContext('2d') as CanvasRenderingContext2D;

  ctx.canvas.height = height * factor;
  ctx.canvas.width = width * factor;

  ctx.font = 'bold 40px Helvetica, Arial, sans-serif';

  // ctx.fillStyle = 'grey';
  // ctx.fillRect(0, 0, width * factor, height * factor);

  const chars = text.split('\n');

  chars.forEach((char: string, index: number) => {
    let textBaseline: CanvasTextBaseline = 'middle';
    let y = padding;

    if (index === 0) {
      textBaseline = 'top';
    } else if (index === 1) {
      textBaseline = 'bottom';
      y = height * factor - padding;
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = textBaseline;
    ctx.fillStyle = color;
    ctx.fillText(char, padding, y, 100 * factor);
  });

  ctx.scale(1 / factor, 1 / factor);

  const texture = new THREE.CanvasTexture(ctx.canvas);
  const geometry = new THREE.PlaneGeometry(width, height);

  texture.minFilter = THREE.LinearFilter;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;

  const material = new THREE.MeshPhongMaterial({
    map: texture,
    specular: 0x111111,
    transparent: true,
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
}

export default createKeyprint;
