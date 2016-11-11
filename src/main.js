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
  'a-scene',
  //'a-entity',
  // ...
];

new Vue({
  el: '#app',
  render: h => h(App)
});
