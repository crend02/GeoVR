<template>
  <a-entity>
    <!-- left hand has teleport, right hand has cursor -->
    <a-entity
      hand-controls="left"
      position="-0.25 -0.25 -0.5"
    ></a-entity>
    <a-entity id="cursor"
      hand-controls="right"
      position="0.25 -0.25 -0.5"
      :vive-cursor="cursor"
    ></a-entity>
  </a-entity>
</template>

<script>
// TODO: get controller handmodels offline
import teleport from 'aframe-teleport-controls';
import cursor from 'aframe-vive-cursor-component';

export default {
  name: 'vive-controllers',
  props: {
    cursor: { type: Boolean, default: true }
  }
};
</script>

<style scoped>

</style>
