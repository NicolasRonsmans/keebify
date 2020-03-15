import * as THREE from 'three';

export function assignUVs(geometry: THREE.Geometry) {
  geometry.faceVertexUvs[0] = [];
  geometry.faces.forEach((face: any) => {
    const components = ['x', 'y', 'z'].sort((a: any, b: any) => {
      return Math.abs(face.normal[a]) - Math.abs(face.normal[b]);
    });

    const v1: any = geometry.vertices[face.a];
    const v2: any = geometry.vertices[face.b];
    const v3: any = geometry.vertices[face.c];

    geometry.faceVertexUvs[0].push([
      new THREE.Vector2(v1[components[0]], v1[components[1]]),
      new THREE.Vector2(v2[components[0]], v2[components[1]]),
      new THREE.Vector2(v3[components[0]], v3[components[1]]),
    ]);
  });

  geometry.uvsNeedUpdate = true;
}
