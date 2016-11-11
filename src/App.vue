<template>
  <div id="app">
    <button id="move-btn" v-on:click="moveBlue">move blue</button>

    <a-scene stats>
      <geometry v-for="obj in sceneObjects"
        :id="obj.id"
        :position="obj.position"
        :geometry="obj.geometry"
        :rotation="obj.rotation"
        :material="obj.material"
      ></geometry>

      <a-entity position="0 0 5">
        <a-camera look-controls wasd-controls>
          <a-cursor></a-cursor>
        </a-camera>
      </a-entity>

      <a-plane rotation="-90 0 0" color="grey" width="5000" height="5000"></a-plane>
      <a-sky color="#E8E8FA"></a-sky>
    </a-scene>

  </div>
</template>

<script>
import AFRAME from 'aframe';
import geometry from './geometry.vue';
import sceneObjects from './assets/scene.json';

export default {
  name: 'app',
  components: {
    geometry
  },
  data() { return {
    sceneObjects
  }},
  methods: {
    moveBlue() { this.sceneObjects[1].position.y += 0.3; }
  }
};
</script>

<style scoped>
/* styles for this component. apply only to this component! */
  #move-btn {
    z-index: 100000;
    position: absolute;
    bottom: 30px;
    left: 50%;
    right: 50%;
  }
</style>
