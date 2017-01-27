/* global AFRAME, THREE */

import AFRAME from './aframe-master.js'

AFRAME.registerComponent('getsize', {
  schema: {default: "thing" },
  update (oldData) {
    // timeout required for the models to be loaded
    setTimeout(() => {
      const bbox = new THREE.Box3().setFromObject(this.el.object3D);
      const x = Math.abs(bbox.max.x - bbox.min.x);
      const y = Math.abs(bbox.max.y - bbox.min.y);
      const z = Math.abs(bbox.max.z - bbox.min.z);
      const stats = {
        component: this.data,
        size: { x, y, z },
        scale: {
          x: 1 / x,
          y: 1 / y,
          z: 1 / z
        }
      };
      // use size of shortest edge for scaling, so the shortest edge is always 1
      const s = Math.max(stats.scale.x, stats.scale.z);
      stats.scaleString = `id='${this.data}' scale='${[s,s,s].join(' ')}' `
      console.log(JSON.stringify(stats, null, 2));
    }, 3000)
  }
});
