/* global AFRAME, THREE */

/**
 * vive-trackpad-controls
 * this component binds functionality to the enhanced
 * 'vive-trackpad-controls' events by updating some components property
 */

import AFRAME from './aframe-master.js'
import { modulo } from './helpers.js'

const COMPONENT_NAME = 'vive-object-palette';

AFRAME.registerComponent(COMPONENT_NAME, {
  dependencies: ['vive-place-objects'],
  schema: {
    // comma separated array of mixins, wich we iterate through
    values: { type: 'array', default: ['tree', 'street', 'greenarea'] },
    // the component and property we want to populate on the same entity
    target: { default: 'vive-place-objects/placedObjectMixin',
      parse (v) {
        const [component, property] = v.split('/');
        return { component, property };
      }
    }
  },

  init () {
    this.rotationMixins = ['rot0', 'rot90', 'rot180', 'rot270'];

    // create the mixins for rotation values
    const assets = document.querySelector('a-assets');
    for (let mixin of this.rotationMixins) {
      let el = document.createElement('a-mixin');
      el.setAttribute('id', mixin);
      el.setAttribute('rotation', `0 ${mixin.replace(/\D/g,'')} 0`);
      assets.appendChild(el)
    }
    this.eventListeners = {
      'click': this.onTrackpadButtonDown.bind(this),
      'trackpad-button-down': this.onTrackpadButtonDown.bind(this),
      'trackpad-scroll': this.onTrackpadScroll.bind(this),
    };
  },
  update () {
    this.valIndex = 0; // current index
    this.rotIndex = 0; // current rotation
    this.setTargetProperty();
  },
  play () { this.attachEventListeners(); },
  pause () { this.removeEventListeners(); },
  remove () { this.removeEventListeners(); },

  attachEventListeners () {
    for (const event in this.eventListeners)
      this.el.addEventListener(event, this.eventListeners[event]);
  },

  removeEventListeners () {
    for (const event in this.eventListeners)
      this.el.removeEventListener(event, this.eventListeners[event]);
  },

  onTrackpadButtonDown (ev) {
    //if (ev.detail.cardinal === 'right')     this.valIndex++;
    //else if (ev.detail.cardinal === 'left') this.valIndex--;
    this.valIndex++;
    this.setTargetProperty();
  },

  onTrackpadScroll (ev) {
    if (ev.detail.direction === 'cw') this.rotIndex--;
    else if (ev.detail.direction === 'ccw') this.rotIndex++;
    this.setTargetProperty();
  },

  // sets the specified components' property
  // (and triggers update() there)
  setTargetProperty () {
    const t = this.data.target;

    // get strings for value & rotation & join them
    const mixinString = [
      this.data.values[modulo(this.valIndex, this.data.values.length)],
      this.rotationMixins[modulo(this.rotIndex, this.rotationMixins.length)]
    ].join(' ');

    // set the mixin string on the target
    this.el.setAttribute(t.component, {
      [t.property]: mixinString
    });
  }
});
