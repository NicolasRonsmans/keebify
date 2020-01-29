import { isString, isObject } from 'lodash';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

type layoutKey =
  | string
  | {
      a?: number;
      h?: number;
      c?: string;
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
        { c: '#D0344C' },
        '~\n`',
        { c: '#34317C' },
        '!\n1',
        { c: '#34317C' },
        '@\n2',
        { c: '#34317C' },
        '#\n3',
        { c: '#34317C' },
        '$\n4',
        { c: '#34317C' },
        '%\n5',
        { c: '#34317C' },
        '^\n6',
        { c: '#34317C' },
        '&\n7',
        { c: '#34317C' },
        '*\n8',
        { c: '#34317C' },
        '(\n9',
        { c: '#34317C' },
        ')\n0',
        { c: '#34317C' },
        '_\n-',
        { c: '#34317C' },
        '+\n=',
        { w: 2, c: '#292351' },
        'Backspace',
      ],
      [
        { w: 1.5, c: '#292351' },
        'Tab',
        { c: '#34317C' },
        'Q',
        { c: '#34317C' },
        'W',
        { c: '#34317C' },
        'E',
        { c: '#34317C' },
        'R',
        { c: '#34317C' },
        'T',
        { c: '#34317C' },
        'Y',
        { c: '#34317C' },
        'U',
        { c: '#34317C' },
        'I',
        { c: '#34317C' },
        'O',
        { c: '#34317C' },
        'P',
        { c: '#34317C' },
        '{\n[',
        { c: '#34317C' },
        '}\n]',
        { w: 1.5, c: '#34317C' },
        '|\n\\',
      ],
      [
        { w: 1.75, c: '#292351' },
        'Caps Lock',
        { c: '#34317C' },
        'A',
        { c: '#34317C' },
        'S',
        { c: '#34317C' },
        'D',
        { c: '#34317C' },
        'F',
        { c: '#34317C' },
        'G',
        { c: '#34317C' },
        'H',
        { c: '#34317C' },
        'J',
        { c: '#34317C' },
        'K',
        { c: '#34317C' },
        'L',
        { c: '#34317C' },
        ':\n;',
        { c: '#34317C' },
        '"\n\'',
        { w: 2.25, c: '#D0344C' },
        'Enter',
      ],
      [
        { w: 2.25, c: '#292351' },
        'Shift',
        { c: '#34317C' },
        'Z',
        { c: '#34317C' },
        'X',
        { c: '#34317C' },
        'C',
        { c: '#34317C' },
        'V',
        { c: '#34317C' },
        'B',
        { c: '#34317C' },
        'N',
        { c: '#34317C' },
        'M',
        { c: '#34317C' },
        '<\n,',
        { c: '#34317C' },
        '>\n.',
        { c: '#34317C' },
        '?\n/',
        { w: 2.75, c: '#292351' },
        'Shift',
      ],
      [
        { w: 1.25, c: '#292351' },
        'Ctrl',
        { w: 1.25, c: '#292351' },
        'Win',
        { w: 1.25, c: '#292351' },
        'Alt',
        { a: 7, w: 6.25, c: '#34317C' },
        '',
        { a: 4, w: 1.25, c: '#292351' },
        'Alt',
        { w: 1.25, c: '#292351' },
        'Win',
        { w: 1.25, c: '#292351' },
        'Menu',
        { w: 1.25, c: '#292351' },
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
    let bg: string = '#ffffff';
    let size: number = 1;
    let x: number = 0;
    let z: number = 0;
    const group: THREE.Group = new THREE.Group();

    LAYOUTS.DEFAULT_60_PERCENT.KEYS.forEach(
      (row: layoutKey[], rowIndex: number) => {
        const rowType = LAYOUTS.DEFAULT_60_PERCENT.ROWS[rowIndex];

        row.forEach((key: layoutKey) => {
          if (isObject(key)) {
            if (key.w) {
              size = key.w;
            }

            if (key.c) {
              bg = key.c;
            }
          } else if (isString(key)) {
            const name = `${size}u-r${rowType}`;
            const geometry = this.keys.cherryMx[name];

            if (!geometry) {
              return;
            }

            const material = new THREE.MeshPhongMaterial({
              color: bg,
              specular: 0x111111,
            });
            const mesh = new THREE.Mesh(geometry, material);

            mesh.castShadow = true;
            mesh.receiveShadow = true;
            mesh.position.set(x + 19 * size * 0.5, 10, z);
            group.add(mesh);

            x += 19 * size;
            bg = '#ffffff';
            size = 1;
          }
        });

        x = 0;
        z += 19;
      }
    );

    this.scene.add(group);

    const box = new THREE.Box3().setFromObject(group);
    const boundingBoxSize = box.max.sub(box.min);
    const width = boundingBoxSize.x;
    const height = boundingBoxSize.z;
    group.position.x = -width / 2;
    group.position.z = -height / 2;
  }
}

export default Three;
