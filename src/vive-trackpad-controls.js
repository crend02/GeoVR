/* global AFRAME, THREE */

/**
 * vive-trackpad-controls
 * this component improves aframes native 'vive-controls' events for the trackpad.
 */

import AFRAME from 'aframe'
import { modulo } from './helpers.js'

const COMPONENT_NAME = 'vive-trackpad-controls';

AFRAME.registerComponent(COMPONENT_NAME, {
  schema: {
    scrollAngleThreshold:  { default: 60 },
    scrollLengthThreshold: { default: 0.2 },
  },

  init () {
    this.trackpadState = {
      vector: new THREE.Vector2(),
      cardinal: null, // ['left', 'right', 'up', 'down']
      angle:    null, // angle in rad from leftright axis
      length:   null, // how far from center? [0, 1]
      scrollCumulative:  0, // cumulative angle since last scrollDirection change
      scrollConsecutive: 0, // updates since the last scrollDirection change
    };

    this.eventListeners = {
      'axismove':     this.onTrackpadUpdate.bind(this),
      'trackpaddown': this.onTrackpadDown.bind(this),
      'touchend': this.onTouchEnd.bind(this),
    };
  },

  play () { this.init(); this.attachEventListeners(); },
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

  onTrackpadUpdate (ev) {
    const a = ev.detail.axis;
    const s = this.trackpadState;

    if (a[0] === 0 && a[1] === 0) return;

    // compute cardinal direction
    if (Math.abs(a[0]) > Math.abs(a[1])) {
      if (a[0] < 0) s.cardinal = 'left';
      else s.cardinal = 'right';
    } else {
      if (a[1] < 0) s.cardinal = 'down';
      else s.cardinal = 'up';
    }

    // compute the shortest angle between the current and previous vectors
    const newVector = new THREE.Vector2().fromArray(a);
    const newAngle = newVector.angle() * 180 / Math.PI;
    let angleDiff = (newAngle - s.angle);
    angleDiff = modulo(angleDiff + 180, 360) - 180;
    s.vector = newVector;
    s.angle = newAngle;
    s.length = newVector.length();

    // ensure the rotation angle is acumulated only in the same direction and for considerable changes
    const largeDiff = Math.abs(angleDiff) > 0.3;
    const consecutiveDirection = (s.scrollCumulative === 0) || (angleDiff > 0) === (s.scrollCumulative > 0);
    const lengthThresh = s.length > this.data.scrollLengthThreshold;
    if (largeDiff && consecutiveDirection && lengthThresh) {
      s.scrollConsecutive++;
      s.scrollCumulative += angleDiff;
    } else {
      s.scrollConsecutive = 0;
      s.scrollCumulative = 0;
    }

    // rotation detected, emit event
    const consecutiveThresh = s.scrollConsecutive > 7; // use min/max time threshold instead?
    const angleThresh = Math.abs(s.scrollCumulative) > this.data.scrollAngleThreshold;
    if (consecutiveThresh && angleThresh) {
      this.el.emit('trackpad-scroll', {
        direction: (s.scrollCumulative > 0) ? 'ccw' : 'cw',
        angle: s.angle,
        cardinal: s.cardinal,
      });
      s.scrollConsecutive = 0;
      s.scrollCumulative = 0;
    }
  },
  onTrackpadDown (ev) {
    // augment the trackpaddown event with our trackpadState, including cardinal dirs
    this.el.emit('trackpad-button-down', this.trackpadState);
  },
  onTouchEnd (ev) {
    // reset the state when user lifts his finger from trackpad
    this.trackpadState.scrollCumulative = 0;
    this.trackpadState.scrollConsecutive = 0;
  }
});
