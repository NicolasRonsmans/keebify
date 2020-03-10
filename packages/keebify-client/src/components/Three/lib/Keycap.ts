import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';

import { KEYS } from '../constants';
import { KeysLibrary, KeyProfile } from '../types';
import { createKeycap } from './helpers';

const library: KeysLibrary = {};
let current: KeyProfile;

async function load(profile: KeyProfile) {
  const keyType = KEYS[profile];

  current = profile;

  // Already loaded.
  if (library[profile]) {
    return Promise.resolve();
  } else {
    library[profile] = {};
  }

  return new Promise(resolve => {
    const toLoad: string[] = [];
    const loader = new STLLoader();

    function load() {
      if (toLoad.length === 0) {
        return resolve();
      }

      const name = toLoad.shift() as string;
      const path = `${keyType.PATH}${name}.stl`;

      loader.load(path, geometry => {
        console.log(`${name} loaded`);
        library[current][name] = geometry;
        load();
      });
    }

    keyType.ROWS.forEach(row => {
      keyType.SIZES.forEach(size => {
        const name = `${size.key}u-r${row}`;

        toLoad.push(name);
      });
    });

    load();
  });
}

function create(name: string, bg: string, key: string) {
  const geometry = library[current][name];

  if (!geometry) {
    return null;
  }

  const mesh = createKeycap(geometry, bg);

  return mesh;
}

export default {
  load,
  create,
};
