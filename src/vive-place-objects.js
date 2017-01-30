/* global AFRAME, THREE */

/**
 * vive-place-objects
 * this component allows placement & dragging of objects
 * onto another object using the vive cursor.
 * depends on vive-controls & vive-cursor.
 */

import AFRAME from './aframe-master.js'
import { snapToGrid } from './helpers.js'
import { insertQTree, removeFromQTree, updateQTree, checkQTree } from './qtree.js'

import QuadTree from 'simple-quadtree';
var qt = QuadTree(-75, -50, 150, 150);

const COMPONENT_NAME = 'vive-place-objects';
const STATES = {
  DRAWING: COMPONENT_NAME + '_drawing',
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

  init() {
    this.dragEl = null; // reference to the object we're currently dragging
    this.previewEl = null; // reference to the preview entity
    this.previewTimeout = null; // timeoutId for preview of new object
    this.drawTargetIntersection = null; // point of intersection, when intersecting with drawTarget

    // define the listeners on this.el here, so we can bind them to 'this'.
    this.eventListeners = {
      'trackpad-button-down': this.onTrackPadDown.bind(this),
      'trackpadup': this.onTrackPadUp.bind(this),
      'mouseup': this.onTriggerUp.bind(this),
      'raycaster-intersection': this.onIntersection.bind(this)
    };
    // applied to .placed-object, not this.el
    this.onDragTargetTriggerDown = this.onDragTargetTriggerDown.bind(this);
  },

  // aframe lifecycle hook: called when component attributes have been changed
  update(oldData) {
    // abort, if we dont know where to draw on
    if (!this.data.drawTarget)
      return console.error(`[${COMPONENT_NAME}] no valid draw target defined!`);

    // (re)create the preview entity
    if (!this.previewEl || this.data.placedObjectMixin !== oldData.placedObjectMixin) {
      // FIXME: throws weird error on first call?
      if (this.previewEl) this.el.sceneEl.removeChild(this.previewEl);
      this.previewEl = document.createElement('a-entity');
      this.el.sceneEl.appendChild(this.previewEl);
      if (this.data.placedObjectMixin)
        this.previewEl.setAttribute('mixin', this.data.placedObjectMixin);
      // reset material, so preview separates from the actual entity
      this.previewEl.setAttribute('material', 'opacity: 0.5; transparent: true');
      this.previewEl.setAttribute('id', COMPONENT_NAME + '-preview');

      // hide the preview. if its recreated wait a bit to give feedback
      if (this.previewTimeout) clearTimeout(this.previewTimeout);
      this.previewTimeout = setTimeout(() => {
        this.previewEl.setAttribute('visible', false);
      }, !this.previewEl ? 0 : 1500);
    }

    // (re)attach the listeners, when drawtarget or objectclass changed
    if (this.data.placedObjectClass !== oldData.placedObjectClass) {
      this.removeEventListeners(oldData.placedObjectClass);
      this.attachEventListeners();
    }
  },

  remove() {
    this.removeEventListeners();
    this.el.sceneEl.removeChild(this.previewEl);
  },

  attachEventListeners() {
    for (const event in this.eventListeners)
      this.el.addEventListener(event, this.eventListeners[event]);
    for (const el of document.querySelectorAll('.' + this.placedObjectClass))
      el.addEventListener('mousedown', this.onDragTargetTriggerDown);
  },

  removeEventListeners(placedObjectClass = this.data.placedObjectClass) {
    for (const event in this.eventListeners)
      this.el.removeEventListener(event, this.eventListeners[event]);
    for (const el of document.querySelectorAll('.' + placedObjectClass))
      el.removeEventListener('mousedown', this.onDragTargetTriggerDown);
  },

  // check if cursor intersects with the drawTarget and update intersection point
  onIntersection(ev) {
    this.drawTargetIntersection = null;
    for (let i = 0; i < ev.detail.els.length; i++) {
      if (ev.detail.els[i] === this.data.drawTarget) {
        this.drawTargetIntersection = ev.detail.intersections[i].point;
        this.updateTargetPosition(ev.detail.intersections[i].point);
        break;
      }
    }
  },

  // trigger down while pointing at placed object enables dragging mode
  onDragTargetTriggerDown(ev) {
    this.el.addState(STATES.DRAGGING);
    this.dragEl = ev.target;
  },
  // trigger up disables dragging mode
  onTriggerUp(ev) {
    this.el.removeState(STATES.DRAGGING);
    this.dragEl = null;
  },

  onTrackPadDown(ev) {
    // lower trackpad deletes currently dragged object
    if (ev.detail.cardinal === 'down' && this.el.is(STATES.DRAGGING)) {
      this.dragEl.parentElement.removeChild(this.dragEl);
      this.dragEl = null;
    }

    // lower trackpad places a object
    else if (ev.detail.cardinal === 'down' && this.drawTargetIntersection)
      this.placeObject(this.drawTargetIntersection);

    // upper trackpad enables drawing mode
    else if (ev.detail.cardinal === 'up')
      this.el.addState(STATES.DRAWING);
  },

  onTrackPadUp(ev) {
    this.el.removeState(STATES.DRAWING);
  },

  placeObject(point) {
    // create a new element with the current pointer position & add it to the scene
    const newElement = document.createElement('a-entity');
    if (this.data.snapToGrid) point = snapToGrid(point, this.data.snapToGrid);
    point.y += 0.001; // avoid z-fighting
    newElement.setAttribute('position', point);
    newElement.setAttribute('mixin', this.data.placedObjectMixin);
    newElement.classList.add(this.data.placedObjectClass);
    this.data.placedObjectContainer.appendChild(newElement);
    newElement.addEventListener('mousedown', this.onDragTargetTriggerDown);
    insertQTree(qt, newElement, point);
  },

  updateTargetPosition(point) {
    let el
    if (this.el.is(STATES.DRAWING)) {
      let intersectObj = checkQTree(qt, this.previewEl, point);
      console.log("intersecting Objects: " + intersectObj);
      this.placeObject(point);
    }
    if (this.el.is(STATES.DRAGGING)) el = this.dragEl;
    if (!el) el = this.previewEl;

    if (this.data.snapToGrid) point = snapToGrid(point, this.data.snapToGrid);
    point.y += 0.001; // avoid z-fighting
    el.setAttribute('position', point);
  }
});
