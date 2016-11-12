<template>
  <a-entity
    layout="type: circle; radius: 1.2"
    :rotation="toggleVisible"
    position="0 -2 -2">
    <a-plane v-for="btn in items.buttonRing"
      rotation="-90 0 0"
      width="1"
      height="0.7"
      material="shader: flat; color: #30b4aa"
      :bmfont-text="'text: ' + btn.text"
    ></a-plane>
  </a-entity>
</template>

<script>
// TODO: get fonts offline
// TODO: attach event handlers
// TODO: animate

import layout from 'aframe-layout-component';
import text from 'aframe-bmfont-text-component';

export default {
  name: 'hud',
  props: {
    enabled: { type: Boolean, default: true },
    items: { type: Object, default: { buttonRing: [] } }
  },
  computed: {
    // toggle visibility via rotation. TODO: animate?
    toggleVisible() { return this.enabled ? '90 0 0' : '0 0 0'; },
  }
};
</script>

<style scoped>

</style>
