<template>
  <div id="app">

    <!--<div id="debug-btns">
      <button v-on:click="moveBlue()">move blue</button>
      <button v-on:click="enableStatistics = !enableStatistics">toggle stats</button>
      <button v-on:click="enableCursor = !enableCursor">toggle cursor</button>
      <button v-on:click="enableHud = !enableHud">toggle HUD</button>
    </div>-->

    <a-scene :stats="enableStatistics">

      <a-assets>
        <a-asset-item id="buildings" src="models/buildings/1_SurroundingBuildings.dae">
        <img id="ground" src="models/buildings/ground.png"/>
      </a-assets>

      <a-entity teleport-controls vive-controls="hand: left"></a-entity>
      <a-entity teleport-controls vive-controls="hand: right"></a-entity>

      <a-collada-model src="#buildings"></a-collada-model>

      <!-- floor + sky. TODO: use custom infinite shader for floor --
      <a-plane rotation="-90 0 0" color="grey" width="5000" height="5000"></a-plane>
      <a-sky color="#E8E8FA"></a-sky>-->
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
import Teleport from 'aframe-teleport-controls';

import Geometry from './Geometry.vue';
import ViveControllers from './ViveControllers.vue';

export default {
  name: 'app',
  components: {
    Geometry,
    ViveControllers,
  },
  data() { return {
    enableStatistics: false,
    enableCursor: true,
  }}
};
</script>

<style scoped>
/* styles for this component. apply only to this component! */

</style>
