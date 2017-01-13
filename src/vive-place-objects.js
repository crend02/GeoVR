/* global AFRAME, THREE */

/**
 * vive-place-objects
 * this component allows placement & dragging of objects
 * onto another object using the vive cursor.
 * depends on vive-controls & vive-cursor.
 */

// TODO: configuration: object type, button mapping?

import AFRAME from './aframe-master.js'
import { snapToGrid } from './helpers.js'

const COMPONENT_NAME = 'vive-place-objects';
const STATES = {
  PLACING: COMPONENT_NAME + '_placing',
  DRAGGING: COMPONENT_NAME + '_dragging'
};

AFRAME.registerComponent(COMPONENT_NAME, {
  schema: {
    drawTarget: { type: 'selector', default: '' },
    placedObjectClass: { type: 'string', default: 'placed-object' },
    placedObjectContainer: { type: 'selector', default: 'a-scene' },
    snapToGrid: { default: 1 }, // 0 = disabled, other numbers define grid size
  },

  init () {
    // preview of the object we're going to place
    this.placePreviewEl = document.createElement('a-box');
    this.placePreviewEl.setAttribute('visible', 'false');
    document.querySelector('a-scene').appendChild(this.placePreviewEl);
    this.dragEl = null; // reference to the object we're currently dragging

    // define the listeners here, so we can bind them to 'this'.
    this.eventListeners = {
      // update position of dragged/preview object while we're pointing on the draw target
      onDrawTargetIntersection: function (ev) {
        this.updateTargetPosition(ev.detail.intersection.point);
      }.bind(this),

      // when in placing mode, place a object by pressing the trigger
      onDrawTargetClicked: function (ev) {
        if (this.el.is(STATES.PLACING))
          this.placeObject(ev.detail.intersection.point);
      }.bind(this),

      // trackpad toggles placing mode
      onTrackPadDown: function (ev) {
        this.el.addState(STATES.PLACING);
        this.placePreviewEl.setAttribute('visible', 'true');
      }.bind(this),
      onTrackPadUp: function (ev) {
        this.el.removeState(STATES.PLACING);
        this.placePreviewEl.setAttribute('visible', 'false');
      }.bind(this),

      // trigger while pointing at placed object toggles dragging mode
      onDragTargetMouseDown: function (ev) {
        this.el.addState(STATES.DRAGGING);
        this.dragEl = ev.target;
      }.bind(this),
      onDragTargetMouseUp: function (ev) {
        this.el.removeState(STATES.DRAGGING);
        this.dragEl = null;
      }.bind(this)
    };
  },

  // aframe lifecycle hook: called when component attributes have been changed
  update (oldData) {
    this.removeEventListeners(oldData.drawTarget, oldData.placedObjectClass);

    // abort, if we dont know where to draw on
    if (!this.data.drawTarget)
      return console.error(`[${COMPONENT_NAME}] no valid draw target defined!`);

    this.attachEventListeners();
  },

  // aframe lifecycle hook
  remove () {
    this.removeEventListeners(this.data.drawTarget);
    document.querySelector('a-scene').removeChild(this.placePreviewEl);
  },

  attachEventListeners (drawTarget = this.data.drawTarget, placedObjectClass = this.data.placedObjectClass) {
    const placedObjs = document.querySelectorAll('.' + placedObjectClass);
    placedObjs.forEach(el => {
      el.addEventListener('mousedown', this.eventListeners.onDragTargetMouseDown);
      el.addEventListener('mouseup', this.eventListeners.onDragTargetMouseUp)
    });

    drawTarget.addEventListener('click', this.eventListeners.onDrawTargetClicked);
    drawTarget.addEventListener('raycaster-intersected', this.eventListeners.onDrawTargetIntersection);
    drawTarget.addEventListener('raycaster-intersected-cleared', this.eventListeners.onDrawTargetIntersectionClear);
    this.el.addEventListener('trackpaddown', this.eventListeners.onTrackPadDown);
    this.el.addEventListener('trackpadup', this.eventListeners.onTrackPadUp);
  },

  removeEventListeners (drawTarget = this.data.drawTarget, placedObjectClass = this.data.placedObjectClass) {
    const placedObjs = document.querySelectorAll('.' + placedObjectClass);
    placedObjs.forEach(el => {
      el.removeEventListener('mousedown', this.eventListeners.onDragTargetMouseDown);
      el.removeEventListener('mouseup', this.eventListeners.onDragTargetMouseUp)
    });

    drawTarget.removeEventListener('click', this.eventListeners.onDrawTargetClicked);
    drawTarget.removeEventListener('raycaster-intersected', this.eventListeners.onDrawTargetIntersection);
    drawTarget.removeEventListener('raycaster-intersected-cleared', this.eventListeners.onDrawTargetIntersectionClear);
    this.el.removeEventListener('trackpaddown', this.eventListeners.onTrackPadDown);
    this.el.removeEventListener('trackpadup', this.eventListeners.onTrackPadUp);
  },

  placeObject (point) {
    // create a new element with the current pointer position & add it to the scene
    const newElement = document.createElement('a-box');
    newElement.setAttribute('position', [point.x, point.y, point.z].join(' '));
    newElement.setAttribute('color', '#f00');
    newElement.classList.add(this.data.placedObjectClass);
    document.querySelector(this.data.placedObjectContainer).appendChild(newElement);
    newElement.addEventListener('mousedown', this.eventListeners.onDragTargetMouseDown);
    newElement.addEventListener('mouseup', this.eventListeners.onDragTargetMouseUp);
  },

  updateTargetPosition (point) {
    const gridSize = this.data.snapToGrid;
    let el;
    if (this.el.is(STATES.DRAGGING))     el = this.dragEl;
    else if (this.el.is(STATES.PLACING)) el = this.placePreviewEl;
    if (!el) return;
    if (gridSize) point = snapToGrid(point, gridSize);
    el.setAttribute('position', [point.x, point.y, point.z].join(' '));
  }
});
