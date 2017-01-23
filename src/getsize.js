/* global AFRAME, THREE */

import AFRAME from './aframe-master.js'

AFRAME.registerComponent('getsize', {
  schema: {default: "thing" },
  // aframe lifecycle hook: called when component attributes have been changed
  update (oldData) {
    setTimeout(() => {
      const bbox = new THREE.Box3().setFromObject(this.el.object3D);
      //bbox.update(this.el.object3D)
      const xDiff = Math.abs(bbox.min.x) + Math.abs(bbox.max.x);
      console.log(this.data, xDiff, 1/xDiff);
    }, 3000)
  }
});
