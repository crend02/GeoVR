/* global AFRAME, THREE */

/**
 * vive-place-objects
 * this component allows placement & dragging of objects
 * onto another object using the vive cursor.
 * depends on vive-controls & vive-cursor.
 */

import AFRAME from './aframe-master.js'
import { snapToGrid, getElementType } from './helpers.js'
import constraintMap from './constraintmap.js'
import checkConstraints from './constraintchecker.js'

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
    this.textEl = null; //reference to text entity showing constraints
    this.textTimeout = null; // timeoutID for text of contraints

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

    this.validPosition = false;

    // (re)create the preview entity
    if (!this.previewEl || this.data.placedObjectMixin !== oldData.placedObjectMixin) {
      // FIXME: throws weird error on first call?
      if (this.previewEl) this.el.sceneEl.removeChild(this.previewEl);
      this.previewEl = document.createElement('a-entity');
      if (this.data.placedObjectMixin)
        this.previewEl.setAttribute('mixin', this.data.placedObjectMixin);
      this.el.sceneEl.appendChild(this.previewEl);
      // reset material, so preview separates from the actual entity
      this.previewEl.setAttribute('obj-model', { mtl: null });
      this.previewEl.setAttribute('material', {
        opacity: 0.5,
        transparent: true,
        color: '#3a3'
      });
      this.previewEl.setAttribute('id', COMPONENT_NAME + '-preview');

      // update it's position when it's model has loaded.
      if (this.drawTargetIntersection)
        this.previewEl.addEventListener('model-loaded', this.updateTargetPosition.bind(this));

      // show the preview when its recreated to give feedback
      this.previewEl.setAttribute('visible', false);
      //if (this.previewEl) this.showPreview();
      // TODO: show name of the object
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
    const lastIntersection = this.drawTargetIntersection || {};
    this.drawTargetIntersection = null;
    for (let i = 0; i < ev.detail.els.length; i++) {
      if (ev.detail.els[i] === this.data.drawTarget) {
        this.drawTargetIntersection = ev.detail.intersections[i].point;
        // only update if position changed
        if (!AFRAME.utils.deepEqual(lastIntersection, this.drawTargetIntersection))
          this.updateTargetPosition();
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
    if (!this.el.is(STATES.DRAGGING)) return;
    if (!this.validPosition) return; // only if position is valid
    // update constraintMap using cached position
    constraintMap.remove(this.dragEl, this.dragEl.lastPosition);
    constraintMap.insert(this.dragEl);
    this.dragEl.lastPosition = this.dragEl.getAttribute('position');
    this.el.removeState(STATES.DRAGGING);
    this.dragEl = null;
  },

  onTrackPadDown(ev) {
    // lower trackpad deletes currently dragged object
    if (ev.detail.cardinal === 'down' && this.el.is(STATES.DRAGGING)) {
      constraintMap.remove(this.dragEl, this.dragEl.lastPosition);
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

  showPreview(duration = 1500) {
    this.previewEl.setAttribute('visible', true);
    if (this.previewTimeout) clearTimeout(this.previewTimeout);
    this.previewTimeout = setTimeout(() => {
      this.previewEl.setAttribute('visible', false);
    }, duration);
  },

  placeObject(point) {
    // only if position is marked valid
    if (!this.validPosition) return;

    // create a new element with the current pointer position & add it to the scene
    const newElement = document.createElement('a-entity');
    if (this.data.snapToGrid) point = snapToGrid(point, this.data.snapToGrid);
    point.y += 0.001; // avoid z-fighting
    newElement.setAttribute('position', point);
    newElement.setAttribute('mixin', this.data.placedObjectMixin);
    newElement.classList.add(this.data.placedObjectClass);
    newElement.lastPosition = point;
    this.data.placedObjectContainer.appendChild(newElement);
    newElement.addEventListener('mousedown', this.onDragTargetTriggerDown);

    // add the object to the constraintMap
    // need to wait for model to be loaded to get its dimensions (~3-70ms)
    newElement.addEventListener('model-loaded', () => {
      constraintMap.insert(newElement);
    });
  },

  updateTargetPosition(point = this.drawTargetIntersection) {
    // update position of previewEl or dragEl (when in dragging mode)
    // to `point`, after applying a snap2grid.
    let el;
    if (this.el.is(STATES.DRAWING)) this.placeObject(point);
    if (this.el.is(STATES.DRAGGING)) el = this.dragEl;
    if (!el) el = this.previewEl;
    if (this.data.snapToGrid) point = snapToGrid(point, this.data.snapToGrid);
    point.y += 0.001; // avoid z-fighting
    el.setAttribute('position', point);

    // check for constraints on the given position
    let result = checkConstraints(el);
    this.validPosition = result.valid;
    if (result.valid) {
      this.previewEl.setAttribute('material', { color: '#3a3' });
    } else {
      // give visual feedback if constraints are not met
      this.previewEl.setAttribute('material', { color: '#a33' });
      

      // show which constraints failed to user
      this.textEl = document.getElementById('constraint-text');
      var textposition = point;
      textposition.y += 1;
      textposition.x += -1.5;
      textposition.z += 0.5;
      var textsize = 0.1;
      this.textEl.setAttribute("position", textposition);
      var rotation = this.el.sceneEl.camera.el.getAttribute("rotation");
      this.textEl.setAttribute("rotation", rotation);

      if (result.unmetRules.self.length > 0) {
        console.log(JSON.stringify(result, null, 2));
        var str = result.unmetRules.self[0].split(' ');
        if (str[0] == 'REQUIRES') {
          this.textEl.setAttribute('text', { 'text': `Invalid position, ${getElementType(el)} needs to be placed on ` + str[1], 'size': textsize });
        }
        if (str[0] == 'FORBIDS') {
          this.textEl.setAttribute('text', { 'text': `Invalid position, ${getElementType(el)} forbids to be places on ` + str[1], 'size': textsize });
        }
      }
      if (result.unmetRules.adjacent.length > 0) {
        console.log(JSON.stringify(result, null, 2));
        var str = result.unmetRules.adjacent[0].split(' ');
        if (str[0] == 'REQUIRES') {
          this.textEl.setAttribute('text', { 'text': `Invalid position, ${getElementType(el)} needs to be placed next to ` + str[1], 'size': textsize });
        }
        if (str[0] == 'FORBIDS') {
          this.textEl.setAttribute('text', { 'text': `Invalid position, ${getElementType(el)} forbids to be places next to ` + str[1], 'size': textsize });
        }
      }

      this.showText(500);
    }
    this.showPreview(500);
  },

  showText(duration = 1500) {
    this.textEl.setAttribute('visible', true);
    if (this.textTimeout) clearTimeout(this.textTimeout);
    this.textTimeout = setTimeout(() => {
      this.textEl.setAttribute('visible', false);
    }, duration);
  },
});
