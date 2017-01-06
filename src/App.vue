<template>
  <div id="app">

    <a-scene>
      <a-assets>
        <a-asset-item id="buildings" src="models/buildings/1_SurroundingBuildings.dae">
        <img id="ground" src="models/buildings/ground.png"/>
      </a-assets>

      <vive-controllers />
      <a-collada-model src="#buildings"></a-collada-model>

      <!-- floor + sky. TODO: use custom infinite shader for floor -->
      <a-entity geometry="primitive: plane" material="color: #EEEEEE"
        rotation="-90 0 0"
        scale="180 180 180"
      ></a-entity>
      <a-sky color="#BBBBFF"></a-sky>

    </a-scene>

  </div>
</template>

<script>
import AFRAME from './aframe.min.js';

import Geometry from './Geometry.vue';
import ViveControllers from './ViveControllers.vue';

export default {
  name: 'app',
  components: {
    Geometry,
    ViveControllers,
  },
  data() { return {
    enableCursor: true,
  }}
};
</script>

<style scoped>
/* styles for this component. apply only to this component! */

</style>
