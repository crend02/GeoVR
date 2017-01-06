import AFRAME from './aframe.min.js'

AFRAME.registerComponent('set-sky', {
  schema: {default: ''},
  init() {
    const sky = document.querySelector('a-sky');
    this.el.addEventListener('click', () => {
      sky.setAttribute('src', this.data);
    });
  }
});
