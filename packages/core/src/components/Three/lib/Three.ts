import { isString, isObject } from 'lodash';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { LAYOUTS, CAMERA } from '../constants';
import { LayoutKey } from '../types';
import { createKeyprint } from './helpers';
import Keycap from './Keycap';

// let el, scene, camera, renderer, controls;

class Three {
  el: HTMLDivElement;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;

  constructor(el: HTMLDivElement) {
    this.el = el;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      CAMERA.FOV,
      CAMERA.ASPECT,
      CAMERA.NEAR,
      CAMERA.FAR
    );
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.init();
  }

  async init() {
    this.setupScene();
    this.setupLights();
    this.setupCamera();
    this.setupGround();
    this.setupControls();
    this.setupRenderer();
    this.setupListeners();

    this.render();
    await Keycap.load('CHERRY_MX');
    this.buildLayout();
  }

  setupScene() {
    this.scene.background = new THREE.Color(0xa0a0a0);
    this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
  }

  setupLights() {
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0.5);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);

    hemiLight.position.set(0, 200, 0);
    dirLight.position.set(0, 200, 100);
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    dirLight.castShadow = true;

    this.scene.add(hemiLight, dirLight);
  }

  setupCamera() {
    const ptLight = new THREE.PointLight(0xffffff, 0.5);

    this.camera.position.set(200, 100, 200);
    this.camera.add(ptLight);
    this.scene.add(this.camera);
  }

  setupGround() {
    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );

    ground.position.set(0, 0, 0);
    ground.rotation.set(-Math.PI / 2, 0, 0);
    ground.receiveShadow = true;

    this.scene.add(ground);
  }

  setupControls() {
    this.controls.update();
  }

  setupRenderer() {
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.el.appendChild(this.renderer.domElement);
  }

  setupListeners() {
    window.addEventListener('resize', () => this.handleResize());
  }

  render = () => {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  };

  buildLayout() {
    let bg: string = '#ccc';
    let fg: string = '#333';
    let size: number = 1;
    let x: number = 0;
    let z: number = 0;
    const group: THREE.Group = new THREE.Group();

    LAYOUTS.DEFAULT_60_PERCENT.KEYS.forEach(
      (row: LayoutKey[], rowIndex: number) => {
        const rowType = LAYOUTS.DEFAULT_60_PERCENT.ROWS[rowIndex];

        row.forEach((key: LayoutKey) => {
          if (isObject(key)) {
            if (key.w) {
              size = key.w;
            }

            if (key.c) {
              bg = key.c;
            }

            if (key.t) {
              fg = key.t;
            }
          } else if (isString(key)) {
            const name = `${size}u-r${rowType}`;
            const posX = (18 + 1) * size;
            const keycap = Keycap.create(name, bg, key);

            // console.log(keycap);
            if (!keycap) {
              return;
            }

            keycap.position.set(x + posX * 0.5, 10, z);

            group.add(keycap);

            if (key) {
              const keyprint = createKeyprint(key, size, rowType, fg);
              const { posZ, posY, rotation } = (() => {
                const base = -Math.PI / 2;
                const unit = Math.PI / 90;
                let posZ: number = z;
                let posY: number = 20;
                let rotation: number = base;

                switch (rowType) {
                  case '1':
                    posZ -= 1.9;
                    posY = 10 + 8.9;
                    rotation += -4.5 * unit;
                    break;
                  case '2':
                    posZ -= 1.9;
                    posY = 10 + 8.5;
                    rotation += -2.6 * unit;
                    break;
                  case '3':
                    posZ -= 1.8;
                    posY = 10 + 9.05;
                    rotation += -0.5 * unit;
                    break;
                  case '4':
                    posZ -= 1.8;
                    posY = 10 + 11;
                    rotation += +1.2 * unit;
                    break;
                }

                return { posZ, posY, rotation };
              })();
              keyprint.position.set(x + posX * 0.5, posY, posZ);
              keyprint.rotation.set(rotation, 0, 0);
              group.add(keyprint);
            }

            x += posX;
            size = 1;
          }
        });

        x = 0;
        z += 19;
      }
    );

    this.scene.add(group);

    // Center group
    const box = new THREE.Box3().setFromObject(group);
    const boundingBoxSize = box.max.sub(box.min);
    const width = boundingBoxSize.x;
    const height = boundingBoxSize.z;
    group.position.x = -width / 2;
    group.position.z = -height / 2;
  }

  handleResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

export default Three;
