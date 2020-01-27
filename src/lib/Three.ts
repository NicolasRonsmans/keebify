import { isString, isObject } from 'lodash';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

type layoutKey =
  | string
  | {
      a?: number;
      h?: number;
      w?: number;
    };

const KEYS = {
  CHERRY_MX: {
    SIZES: ['1', '1.25', '1.5', '1.75', '2', '2.25', '2.5', '2.75', '6.25'],
    ROWS: ['1', '2', '3', '4'],
  },
};
const LAYOUTS = {
  DEFAULT_60_PERCENT: {
    ROWS: ['1', '2', '3', '4', '4'],
    KEYS: [
      [
        '~\n`',
        '!\n1',
        '@\n2',
        '#\n3',
        '$\n4',
        '%\n5',
        '^\n6',
        '&\n7',
        '*\n8',
        '(\n9',
        ')\n0',
        '_\n-',
        '+\n=',
        { w: 2 },
        'Backspace',
      ],
      [
        { w: 1.5 },
        'Tab',
        'Q',
        'W',
        'E',
        'R',
        'T',
        'Y',
        'U',
        'I',
        'O',
        'P',
        '{\n[',
        '}\n]',
        { w: 1.5 },
        '|\n\\',
      ],
      [
        { w: 1.75 },
        'Caps Lock',
        'A',
        'S',
        'D',
        'F',
        'G',
        'H',
        'J',
        'K',
        'L',
        ':\n;',
        '"\n\'',
        { w: 2.25 },
        'Enter',
      ],
      [
        { w: 2.25 },
        'Shift',
        'Z',
        'X',
        'C',
        'V',
        'B',
        'N',
        'M',
        '<\n,',
        '>\n.',
        '?\n/',
        { w: 2.75 },
        'Shift',
      ],
      [
        { w: 1.25 },
        'Ctrl',
        { w: 1.25 },
        'Win',
        { w: 1.25 },
        'Alt',
        { a: 7, w: 6.25 },
        '',
        { a: 4, w: 1.25 },
        'Alt',
        { w: 1.25 },
        'Win',
        { w: 1.25 },
        'Menu',
        { w: 1.25 },
        'Ctrl',
      ],
    ],
  },
};
const FOV = 45;
const ASPECT = window.innerWidth / window.innerHeight;
const NEAR = 1;
const FAR = 1000;

class Three {
  el: HTMLDivElement;
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  loader: STLLoader;
  keys: { cherryMx: { [key: string]: THREE.BufferGeometry } };

  constructor(el: HTMLDivElement) {
    this.el = el;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      logarithmicDepthBuffer: true,
    });
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.loader = new STLLoader();
    this.keys = { cherryMx: {} };

    this.init();
  }

  init() {
    const ground = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(2000, 2000),
      new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false })
    );
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0.5);
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    const ptLight = new THREE.PointLight(0xffffff, 0.5);

    ground.position.set(0, 0, 0);
    ground.rotation.set(-Math.PI / 2, 0, 0);
    ground.receiveShadow = true;
    hemiLight.position.set(0, 200, 0);
    dirLight.position.set(0, 200, 100);
    dirLight.shadow.camera.top = 180;
    dirLight.shadow.camera.bottom = -100;
    dirLight.shadow.camera.left = -120;
    dirLight.shadow.camera.right = 120;
    dirLight.castShadow = true;
    this.scene.background = new THREE.Color(0xa0a0a0);
    this.scene.fog = new THREE.Fog(0xa0a0a0, 200, 1000);
    this.scene.add(this.camera, ground, hemiLight, dirLight);
    this.camera.position.set(200, 100, 200);
    this.camera.add(ptLight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.el.appendChild(this.renderer.domElement);
    this.controls.update();
    this.loadKeys();
    this.render();
  }

  render = () => {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  };

  loadKeys() {
    const names: string[] = [];
    const load = () => {
      if (names.length === 0) {
        this.buildKeeb();
        return;
      }

      const name = names.shift() as string;
      const path = `assets/keys/cherry-mx/${name}.stl`;

      this.loader.load(path, geometry => {
        console.log(`${name} loaded`);
        this.keys.cherryMx[name] = geometry;
        load();
      });
    };

    KEYS.CHERRY_MX.ROWS.forEach(row => {
      KEYS.CHERRY_MX.SIZES.forEach(size => {
        const name = `${size}u-r${row}`;
        names.push(name);
      });
    });

    load();
  }

  buildKeeb() {
    let size: number = 1;
    let x: number = 0;
    let z: number = 0;

    LAYOUTS.DEFAULT_60_PERCENT.KEYS.forEach(
      (row: layoutKey[], rowIndex: number) => {
        const rowType = LAYOUTS.DEFAULT_60_PERCENT.ROWS[rowIndex];

        row.forEach((key: layoutKey) => {
          if (isString(key)) {
            const name = `${size}u-r${rowType}`;
            const geometry = this.keys.cherryMx[name];

            if (!geometry) {
              return;
            }

            const material = new THREE.MeshPhongMaterial({
              color: 0xff5533,
              specular: 0x111111,
            });
            const mesh = new THREE.Mesh(geometry, material);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.position.set(x + 19 * size * 0.5, 20, z);
            this.scene.add(mesh);

            x += 19 * size;
            size = 1;
          } else if (isObject(key) && key.w) {
            size = key.w;
          }
        });

        size = 1;
        x = 0;
        z += 19;
      }
    );
  }
}

export default Three;
