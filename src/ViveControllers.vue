<template>
  <!-- left hand has teleport, right hand has cursor -->
  <a-entity>
    <a-entity teleport-controls vive-controls="hand: left"></a-entity>
    <a-entity vive-cursor vive-controls="hand: right"></a-entity>
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
