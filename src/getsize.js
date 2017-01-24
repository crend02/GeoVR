/* global AFRAME, THREE */

import AFRAME from './aframe-master.js'

AFRAME.registerComponent('getsize', {
  schema: {default: "thing" },
  update (oldData) {
    // timeout required for the models to be loaded
    setTimeout(() => {
      const bbox = new THREE.Box3().setFromObject(this.el.object3D);
      const xDiff = Math.abs(bbox.min.x) + Math.abs(bbox.max.x);
      const yDiff = Math.abs(bbox.min.y) + Math.abs(bbox.max.y);
      const zDiff = Math.abs(bbox.min.z) + Math.abs(bbox.max.z);
      const stats = {
        component: this.data,
        size: {
          x: xDiff,
          y: yDiff,
          z: zDiff
        },
        scale: {
          x: 1 / xDiff,
          y: 1 / yDiff,
          z: 1 / zDiff
        }
      };
      // use size of shortest edge for scaling, so the shortest edge is always 1
      const s = Math.max(stats.scale.x, stats.scale.z);
      stats.scaleString = `id='${this.data}' scale='${[s,s,s].join(' ')}' `
      console.log(JSON.stringify(stats, null, 2));
    }, 3000)
  }
});
