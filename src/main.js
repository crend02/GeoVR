import Vue from 'vue';
import App from './App.vue';

// vue will try to interpret the aframe entities as vue components
// we don't want that. https://github.com/vuejs/vue/issues/3090
Vue.config.ignoredElements = [
  'a-sky',
  'a-entity',
  'a-box',
  'a-sphere',
  'a-plane',
  'a-cylinder',
  'a-node',
  'a-scene',
  'a-mixin',
  'a-assets',
  'a-camera',
  'a-cursor',
  'a-collada-model',
  'a-asset-item',
  //'a-entity',
];

new Vue({
  el: '#app',
  render: h => h(App)
});
