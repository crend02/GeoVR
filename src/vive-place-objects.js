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
  //dependencies: ['vive-cursor', 'vive-controls', 'vive-trackpad-controls'],
  schema: {
    drawTarget: { type: 'selector' },
    placedObjectClass: { type: 'string', default: 'placed-object' },
    placedObjectMixin: { type: 'string' },
    placedObjectContainer: { type: 'selector', default: 'a-scene' },
    snapToGrid: { default: 1 }, // 0 = disabled, other numbers define grid size
  },

  init () {
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

      // trackpad down toggles placing mode
      onTrackPadDown: function (ev) {
        if (ev.detail.cardinal !== 'down') return;
        this.el.addState(STATES.PLACING);
        this.placePreviewEl.setAttribute('visible', 'true');
      }.bind(this),
      onTrackPadUp: function (ev) {
        this.el.removeState(STATES.PLACING);
        this.placePreviewEl.setAttribute('visible', 'false');
      }.bind(this),

      // trigger while pointing at placed object toggles dragging mode
      onDragTargetMouseDown: function (ev) {
        if (this.el.is(STATES.PLACING)) return;
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
    // abort, if we dont know where to draw on
    if (!this.data.drawTarget)
      return console.error(`[${COMPONENT_NAME}] no valid draw target defined!`);

    // (re)create the preview entity
    if (!this.placePreviewEl || this.data.placedObjectMixin !== oldData.placedObjectMixin) {
      // FIXME: throws weird error on first call?
      if (this.placePreviewEl)
        this.el.sceneEl.removeChild(this.placePreviewEl);
      this.placePreviewEl = document.createElement('a-entity');
      if (this.data.placedObjectMixin)
        this.placePreviewEl.setAttribute('mixin', this.data.placedObjectMixin);
      this.el.sceneEl.appendChild(this.placePreviewEl);

      // hide the preview. if its recreated wait a bit to give feedback
      setTimeout(() => {
        this.placePreviewEl.setAttribute('visible', false);
      }, !this.placePreviewEl ? 0 : 600);
    }

    // (re)attach the listeners, when drawtarget or objectclass changed
    if (this.data.drawTarget !== oldData.drawTarget || this.data.placedObjectClass !== oldData.placedObjectClass) {
      this.removeEventListeners(oldData.drawTarget, oldData.placedObjectClass);
      this.attachEventListeners();
    }
  },

  remove () {
    this.removeEventListeners(this.data.drawTarget);
    this.el.sceneEl.removeChild(this.placePreviewEl);
  },

  attachEventListeners (drawTarget = this.data.drawTarget, placedObjectClass = this.data.placedObjectClass) {
    const placedObjs = document.querySelectorAll('.' + placedObjectClass);
    placedObjs.forEach(el => {
      el.addEventListener('mousedown', this.eventListeners.onDragTargetMouseDown);
      el.addEventListener('mouseup', this.eventListeners.onDragTargetMouseUp);
    });

    drawTarget.addEventListener('click', this.eventListeners.onDrawTargetClicked);
    drawTarget.addEventListener('raycaster-intersected', this.eventListeners.onDrawTargetIntersection);
    drawTarget.addEventListener('raycaster-intersected-cleared', this.eventListeners.onDrawTargetIntersectionClear);
    this.el.addEventListener('trackpad-button-down', this.eventListeners.onTrackPadDown);
    this.el.addEventListener('trackpadup', this.eventListeners.onTrackPadUp);
    this.el.addEventListener('axismove', this.eventListeners.onTrackpadDirectionUpdate);
  },

  removeEventListeners (drawTarget = this.data.drawTarget, placedObjectClass = this.data.placedObjectClass) {
    const placedObjs = document.querySelectorAll('.' + placedObjectClass);
    placedObjs.forEach(el => {
      el.removeEventListener('mousedown', this.eventListeners.onDragTargetMouseDown);
      el.removeEventListener('mouseup', this.eventListeners.onDragTargetMouseUp);
    });

    drawTarget.removeEventListener('click', this.eventListeners.onDrawTargetClicked);
    drawTarget.removeEventListener('raycaster-intersected', this.eventListeners.onDrawTargetIntersection);
    drawTarget.removeEventListener('raycaster-intersected-cleared', this.eventListeners.onDrawTargetIntersectionClear);
    this.el.removeEventListener('trackpaddown', this.eventListeners.onTrackPadDown);
    this.el.removeEventListener('trackpadup', this.eventListeners.onTrackPadUp);
    this.el.removeEventListener('axismove', this.eventListeners.onTrackpadDirectionUpdate);
  },

  placeObject (point) {
    // create a new element with the current pointer position & add it to the scene
    const newElement = document.createElement('a-entity');
    if (this.data.snapToGrid) point = snapToGrid(point, this.data.snapToGrid);
    point.y += 0.001; // avoid z-index interference
    newElement.setAttribute('position', point);
    newElement.setAttribute('mixin', this.data.placedObjectMixin);
    newElement.classList.add(this.data.placedObjectClass);
    this.data.placedObjectContainer.appendChild(newElement);
    newElement.addEventListener('mousedown', this.eventListeners.onDragTargetMouseDown);
    newElement.addEventListener('mouseup', this.eventListeners.onDragTargetMouseUp);
  },

  updateTargetPosition (point) {
    let el;
    if (this.el.is(STATES.DRAGGING))     el = this.dragEl;
    else if (this.el.is(STATES.PLACING)) el = this.placePreviewEl;
    if (!el) return;
    if (this.data.snapToGrid) point = snapToGrid(point, this.data.snapToGrid);
    el.setAttribute('position', point);
  }
});
