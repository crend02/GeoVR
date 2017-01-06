<template>
  <div id="app">
    <a-scene>
      <a-assets>
        <a-asset-item id="buildings" src="models/buildings/1_SurroundingBuildings.dae">
        <img id="ground" src="models/buildings/ground.png"/>
      </a-assets>

      <a-camera>
        <a-cursor color="#4CC3D9" fuse="true" timeout="10"></a-cursor>
      </a-camera>

      <vive-controllers/>

      <a-entity layout="type: circle; radius: 2" rotation="0 90 0" position="1 0.8 -1">
        <!-- TODO: add image src as assets -->
        <a-sphere color="#643B4F" radius="0.2" position="-8 2 0" set-sky="/images/right_front.jpg"></a-sphere>
        <a-sphere color="#694E6A" radius="0.2" position="-6 2 0" set-sky="/images/right_middle.jpg"></a-sphere>
        <a-sphere color="#656484" radius="0.2" position="-4 2 0" set-sky="/images/right_back.jpg"></a-sphere>
        <a-sphere color="#587A98" radius="0.2" position="-2 2 0" set-sky="/images/center_back.jpg"></a-sphere>
        <a-sphere color="#4491A5" radius="0.2" position="0 2 0" set-sky="/images/left_back.jpg"></a-sphere>
        <a-sphere color="#35A8A8" radius="0.2" position="2 2 0" set-sky="/images/middle_left.jpg"></a-sphere>
        <a-sphere color="#41BDA2" radius="0.2" position="4 2 0" set-sky="/images/middle_center.jpg"></a-sphere>
        <a-sphere color="#65CF94" radius="0.2" position="6 2 0" set-sky="/images/left_front.jpg"></a-sphere>
      </a-entity>

      <!-- buildings -->
      <a-collada-model src="#buildings"
        scale="-1 2 -1"
        rotation="180 0 0"
        position="0 4 0"
      ></a-collada-model>

      <!-- floor + sky. TODO: use custom infinite shader for floor -->
      <a-entity geometry="primitive: plane" material="color: #EEEEEE"
        rotation="-90 0 0"
        scale="180 180 180"
      ></a-entity>

      <a-sky radius="360" color="#BBBBFF"></a-sky>

    </a-scene>
  </div>
</template>

<script>
import AFRAME from './aframe.min.js';
import aframeComponents from './aframe_components.js';

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
