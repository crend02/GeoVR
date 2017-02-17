import AFRAME from './aframe-master.js';
import grid from 'aframe-gridhelper-component';
import teleport from 'aframe-teleport-controls';

import setSky from './set_sky.js';
import toggleViews from './toggle-views.js';
import viveCursor from './vive-cursor.js';
import vivePlaceObjects from './vive-place-objects.js';
import viveTrackpadControls from './vive-trackpad-controls';
import viveObjectPalette from './vive-object-palette';
import setImages from './set_images.js';
import registerMap from 'aframe-map';
import skyGradient from './skyGradient.js';
import textComponent from 'aframe-text-component';

registerMap(AFRAME);

// for hot reloading of index html
if (process.env.NODE_ENV !== 'production') {
  require('../index.html')
}

// can't attach raycaster to collada-model which isnt loaded yet
// see https://github.com/aframevr/aframe/issues/2319
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('buildings').addEventListener('model-loaded', () => {
    document.getElementById('cursor-ctrl').setAttribute(
      'vive-cursor',
      'objects: #planningarea, .placed-object, .imagegallery, #mview'
    );
  });
});
