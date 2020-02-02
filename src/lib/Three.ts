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
      t?: string;
      w?: number;
    };

const KEYS = {
  CHERRY_MX: {
    SIZES: [
      { key: '1', value: 18 - 5 },
      { key: '1.25', value: 23 - 6 },
      { key: '1.5', value: 28 - 6 },
      { key: '1.75', value: 32 - 6 },
      { key: '2', value: 37 - 6 },
      { key: '2.25', value: 42 - 6 },
      { key: '2.5', value: 47 - 6 },
      { key: '2.75', value: 51 - 6 },
      { key: '6.25', value: 118 - 5 },
    ],
    ROWS: ['1', '2', '3', '4'],
  },
};
const LAYOUTS = {
  DEFAULT_60_PERCENT: {
    ROWS: ['1', '2', '3', '4', '4'],
    KEYS: [
      [
        { c: '#333079', t: '#099AB4' },
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
        { c: '#27234D', t: '#CF334D', a: 6, w: 2 },
        'Backspace',
      ],
      [
        { w: 1.5 },
        'Tab',
        { c: '#333079', t: '#099AB4', a: 4 },
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
        { c: '#27234D', t: '#CF334D', a: 6, w: 1.75 },
        'Caps Lock',
        { c: '#333079', t: '#099AB4', a: 4 },
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
        { c: '#CF334D', t: '#27234D', a: 6, w: 2.25 },
        'Enter',
      ],
      [
        { c: '#27234D', t: '#CF334D', w: 2.25 },
        'Shift',
        { c: '#333079', t: '#099AB4', a: 4 },
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
        { c: '#27234D', t: '#CF334D', a: 6, w: 2.75 },
        'Shift',
      ],
      [
        { w: 1.25 },
        'Control',
        { w: 1.25 },
        'Code',
        { w: 1.25 },
        'Alt',
        { c: '#CF334D', t: '#000000', a: 7, w: 6.25 },
        '',
        { c: '#27234D', t: '#CF334D', a: 6, w: 1.25 },
        'Alt',
        { w: 1.25 },
        'Code',
        { w: 1.25 },
        'Fn',
        { w: 1.25 },
        'Control',
      ],
    ],
  },
};
const FOV = 45;
const ASPECT = window.innerWidth / window.innerHeight;
const NEAR = 1;
const FAR = 1000;

// function assignUVs(geometry: THREE.Geometry) {
//   geometry.faceVertexUvs[0] = [];
//   geometry.faces.forEach((face: any) => {
//     const components = ['x', 'y', 'z'].sort((a: any, b: any) => {
//       return Math.abs(face.normal[a]) - Math.abs(face.normal[b]);
//     });

//     const v1: any = geometry.vertices[face.a];
//     const v2: any = geometry.vertices[face.b];
//     const v3: any = geometry.vertices[face.c];

//     false &&
//       geometry.faceVertexUvs[0].push([
//         new THREE.Vector2(v1[components[0]], v1[components[1]]),
//         new THREE.Vector2(v2[components[0]], v2[components[1]]),
//         new THREE.Vector2(v3[components[0]], v3[components[1]]),
//       ]);
//   });

//   geometry.uvsNeedUpdate = true;
// }

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

class Three {
  el: HTMLDivElement;
  scene: THREE.Scene;
  camera: THREE.Camera;
  renderer: THREE.WebGLRenderer;
  controls: OrbitControls;
  font?: THREE.Font;
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
    this.keys = { cherryMx: {} };

    this.init();
  }

  async init() {
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

    this.render();

    // await this.loadFont();
    await this.loadKeys();

    this.buildKeeb();
  }

  render = () => {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.render);
  };

  loadFont() {
    var loader = new THREE.FontLoader();

    return new Promise(resolve => {
      loader.load(
        'assets/fonts/droid/droid_sans_regular.typeface.json',
        font => {
          this.font = font;

          return resolve();
        }
      );
    });
  }

  loadKeys() {
    const names: string[] = [];
    const loader = new STLLoader();

    KEYS.CHERRY_MX.ROWS.forEach(row => {
      KEYS.CHERRY_MX.SIZES.forEach(size => {
        const name = `${size.key}u-r${row}`;
        names.push(name);
      });
    });

    return new Promise(resolve => {
      const load = () => {
        if (names.length === 0) {
          return resolve();
        }

        const name = names.shift() as string;
        const path = `assets/keys/cherry-mx/${name}.stl`;

        loader.load(path, geometry => {
          console.log(`${name} loaded`);
          this.keys.cherryMx[name] = geometry;
          load();
        });
      };

      load();
    });
  }

  buildKeeb() {
    let bg: string = '#ccc';
    let fg: string = '#333';
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

            if (key.t) {
              fg = key.t;
            }
          } else if (isString(key)) {
            const name = `${size}u-r${rowType}`;
            const bufferGeometry = this.keys.cherryMx[name];

            if (!bufferGeometry) {
              return;
            }

            const posX = (18 + 1) * size;
            const keycap = createKeycap(bufferGeometry, bg);
            // console.log(keycap);

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

    const box = new THREE.Box3().setFromObject(group);
    const boundingBoxSize = box.max.sub(box.min);
    const width = boundingBoxSize.x;
    const height = boundingBoxSize.z;
    group.position.x = -width / 2;
    group.position.z = -height / 2;
  }
}

export default Three;
