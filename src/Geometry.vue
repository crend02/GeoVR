<template>
  <a-entity
    :id="id"
    :position="positionString"
    :rotation="rotationString"
    :geometry="geometryString"
    :material="materialString"
  ></a-entity>
</template>

<script>
/**
 * IDEA: make more abstract -> generic wrapper around a-entity, that accepts any prop
 * see https://github.com/vuejs/vue/issues/2114 and https://github.com/ngokevin/aframe-react
 */

export default {
  name: 'geometry',
  // vue arrays dont support easy databinding (?), so we use objects for coordinates
  props: {
    'id': { type: String },
    'position': {
      type: Object,
      default: function() { return { x: 0, y: 0, z: 0 }; }
    },
    'rotation': {
      type: Object,
      default: function() { return { x: 0, y: 0, z: 0 }; }
    },
    'geometry': {
      type: Object,
      default: function() { return { primitive: 'sphere', radius: 0.5 }; }
    },
    'material': {
      type: Object,
      default: function() { return { color: "red", metalness: 0.3 } }
    }
  },
  // no data, as we inherit everything from the parent as props
  data() { return {} },
  // each prop is transformed to an aframe attribute string
  computed: {
    positionString() {
      return this.makeCoordinateString(this.position);
    },
    rotationString() {
      return this.makeCoordinateString(this.rotation);
    },
    geometryString() {
      return this.makeAttributeString(this.geometry);
    },
    materialString() {
      return this.makeAttributeString(this.material);
    }
  },
  // helpers for prop conversion
  methods: {
    makeAttributeString(obj) {
      let string = '';
      for (let prop in obj)
        string += `${prop}: ${obj[prop]};`;
      return string;
    },
    makeCoordinateString(obj) {
      const { x, y, z } = obj;
      return `${x} ${y} ${z}`;
    }
  }
};
</script>

<style scoped>

</style>
