/* global AFRAME, THREE */

import AFRAME from './aframe-master.js'

AFRAME.registerComponent('getsize', {
  schema: {default: "thing" },
  // aframe lifecycle hook: called when component attributes have been changed
  update (oldData) {
    setTimeout(() => {
      const bbox = new THREE.Box3().setFromObject(this.el.object3D);
      const xDiff = Math.abs(bbox.min.x) + Math.abs(bbox.max.x);
      const yDiff = Math.abs(bbox.min.y) + Math.abs(bbox.max.y);
      const stats = {
        component: this.data,
        xDiff,
        yDiff,
        xDiffInverted: 1/xDiff,
        yDiffInverted: 1/yDiff
      }
      console.log(stats);
    }, 3000)
  }
});
