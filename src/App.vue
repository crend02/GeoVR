<template>
  <div id="app">

    <div id="debug-btns">
      <button v-on:click="moveBlue()">move blue</button>
      <button v-on:click="enableStatistics = !enableStatistics">toggle stats</button>
      <button v-on:click="enableCursor = !enableCursor">toggle cursor</button>
      <button v-on:click="enableHud = !enableHud">toggle HUD</button>
    </div>

    <a-scene :stats="enableStatistics">

      <!-- camera + controllers + hud -->
      <a-entity position="0 0 2.5">
        <a-entity camera="user-height: 1.7" wasd-controls look-controls>
          <hud :enabled="enableHud" :items="hudItems"/>
          <vive-controllers :cursor="enableCursor"/>
        </a-entity>
      </a-entity>

      <!-- load serialized objects in assets/scene.json -->
      <geometry v-for="obj in sceneObjects"
        :id="obj.id"
        :position="obj.position"
        :geometry="obj.geometry"
        :rotation="obj.rotation"
        :material="obj.material"
      ></geometry>

      <!-- floor + sky. TODO: use custom infinite shader for floor -->
      <a-plane rotation="-90 0 0" color="grey" width="5000" height="5000"></a-plane>
      <a-sky color="#E8E8FA"></a-sky>

    </a-scene>

  </div>
</template>

<script>
import AFRAME from 'aframe';
import Geometry from './Geometry.vue';
import ViveControllers from './ViveControllers.vue';
import Hud from './Hud.vue';
import sceneObjects from './assets/scene.json';
import hudItems from './assets/hud.json';

export default {
  name: 'app',
  components: {
    Geometry,
    ViveControllers,
    Hud,
  },
  data() { return {
    sceneObjects,
    hudItems,
    enableStatistics: false,
    enableCursor: true,
    enableHud: true,
  }},
  methods: {
    moveBlue() {
      this.sceneObjects[1].position.y += 0.3;
    },
  }
};
</script>

<style scoped>
/* styles for this component. apply only to this component! */
  #debug-btns {
    z-index: 100000;
    position: absolute;
    bottom: 30px;
    display: flex;
    left: 13px;
  }
  #debug-btns button {
    margin-right: 10px;
  }
</style>
