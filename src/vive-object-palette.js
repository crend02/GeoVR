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
    this.eventListeners = {
      'trackpad-button-down': this.onTrackpadButtonDown.bind(this),
      'trackpad-scroll': this.onTrackpadScroll.bind(this),
    };
  },
  update () {
    this.i = 0; // current index
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
    if (ev.detail.cardinal === 'right')     this.i++;
    else if (ev.detail.cardinal === 'left') this.i--;
    this.setTargetProperty();
  },

  onTrackpadScroll (ev) {
    if (ev.detail.direction === 'cw')       this.i++;
    else if (ev.detail.direction === 'ccw') this.i++;
    this.setTargetProperty();
  },

  // sets the specified components' property
  // (and triggers update() there)
  setTargetProperty (i = this.i) {
    const vs = this.data.values;
    const t = this.data.target;
    this.el.setAttribute(t.component, {
      [t.property]: vs[modulo(i, vs.length)]
    });
  }
});
