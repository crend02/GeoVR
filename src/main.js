import AFRAME from './aframe-master.js';
import grid from 'aframe-gridhelper-component';
import teleport from 'aframe-teleport-controls';

import setSky from './set_sky.js';
import toggleViews from './toggle-views.js';
import viveCursor from './vive-cursor.js';
import vivePlaceObjects from './vive-place-objects.js';
import viveTrackpadControls from './vive-trackpad-controls';
import viveObjectPalette from './vive-object-palette';

// for hot reloading of index html
if (process.env.NODE_ENV !== 'production') {
  require('../index.html')
}


import QuadTree from 'simple-quadtree';
