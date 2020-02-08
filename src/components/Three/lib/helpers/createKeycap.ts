import * as THREE from 'three';

function createKeycap(geometry: THREE.BufferGeometry, bg: string) {
  const material = new THREE.MeshPhongMaterial({
    color: bg,
    specular: 0x111111,
  });
  const mesh = new THREE.Mesh(geometry, material);

  mesh.castShadow = true;
  mesh.receiveShadow = true;

  return mesh;
}

export default createKeycap;
