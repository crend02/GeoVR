/* global AFRAME, THREE */

// vive-cursor-component (https://github.com/bryik/aframe-vive-cursor-component)
// updated to the cursor event interface as defined in aframe 0.4.0
// https://github.com/aframevr/aframe/blob/fec7925/src/components/cursor.js

if (typeof AFRAME === 'undefined') {
  throw new Error('Component attempted to register before AFRAME was available.');
}

var EVENTS = {
  CLICK: 'click',
  MOUSEENTER: 'mouseenter',
  MOUSEDOWN: 'mousedown',
  MOUSELEAVE: 'mouseleave',
  MOUSEUP: 'mouseup'
};

var STATES = {
  HOVERING: 'cursor-hovering',
  HOVERED: 'cursor-hovered'
};

/**
 * Vive cursor component. A modification of the default cursor.
 * Cursor can be fine-tuned by setting raycaster properties.
 *
 * @member {Element} mouseDownEl - Entity that was last mousedowned during current click.
 * @member {Element} intersectedEl - Currently-intersected entity. Used to keep track to
 *         emit events when unintersecting.
 */
AFRAME.registerComponent('vive-cursor', {
  dependencies: ['raycaster'],
  schema: {
    color: {
      type: 'color',
      default: 0x0000ff
    },
    radius: {
      type: 'number',
      default: '0.001'
    },
    objects: {
      type: 'string',
      default: ''
    }
  },

  /**
   * Set if component needs multiple instancing.
   */
  multiple: false,

  /**
   * Called once when component is attached. Generally for initial setup.
   */
  init: function () {
    var cursorEl = this.el;
    var data = this.data;
    var canvas = cursorEl.sceneEl.canvas;
    this.mouseDownEl = null;
    this.intersectedEl = null;
    this.intersection = null;

    // Wait for canvas to load.
    if (!canvas) {
      cursorEl.sceneEl.addEventListener('render-target-loaded', this.init.bind(this));
      return;
    }

    // Create laser beam.
    var cursorGeometry = new THREE.CylinderGeometry(data.radius, data.radius, 1000, 32);
    var cursorMaterial = new THREE.MeshBasicMaterial({color: data.color});
    var cursorMesh = new THREE.Mesh(cursorGeometry, cursorMaterial);
    // Move mesh so that beam starts at the tip of the controller model.
    cursorMesh.position.z = -500;
    // Rotate mesh so that it points directly away from the controller.
    cursorMesh.rotation.x = 90 * (Math.PI / 180);
    this.el.setObject3D('vive-cursor-mesh', cursorMesh);

    // Prevent laser from interfering with raycaster by setting near property
    var rayCasterSettings = 'near: 0.03; objects: ' + data.objects;
    cursorEl.setAttribute('raycaster', rayCasterSettings);

    // Save event listener bindings (needed for removal).
    this.onIntersectionBind = this.onIntersection.bind(this);
    this.onIntersectionClearedBind = this.onIntersectionCleared.bind(this);
    this.onMouseDownBind = this.onMouseDown.bind(this);
    this.onMouseUpBind = this.onMouseUp.bind(this);
  },

  attachEventListeners: function () {
    var cursorEl = this.el;

    cursorEl.addEventListener('raycaster-intersection', this.onIntersectionBind);
    cursorEl.addEventListener('raycaster-intersection-cleared', this.onIntersectionClearedBind);
    // Mouseup/down mapped to trigger.
    cursorEl.addEventListener('triggerdown', this.onMouseDownBind);
    cursorEl.addEventListener('triggerup', this.onMouseUpBind);
  },

  removeEventListeners: function () {
    var cursorEl = this.el;

    cursorEl.removeEventListener('raycaster-intersection', this.onIntersectionBind);
    cursorEl.removeEventListener('raycaster-intersection-cleared', this.onIntersectionClearedBind);
    cursorEl.removeEventListener('triggerdown', this.onMouseDownBind);
    cursorEl.removeEventListener('triggerup', this.onMouseUpBind);
  },

  /**
   * Trigger mousedown and keep track of the mousedowned entity.
   */
  onMouseDown: function (evt) {
    this.twoWayEmit(EVENTS.MOUSEDOWN)
    this.mouseDownEl = this.intersectedEl;
  },

  /**
   * Trigger mouseup if:
   * - Currently intersecting an entity.
   * - Currently-intersected entity is the same as the one when mousedown was triggered,
   *   in case user mousedowned one entity, dragged to another, and mouseupped.
   */
  onMouseUp: function (evt) {
    this.twoWayEmit(EVENTS.MOUSEUP);
    if (!this.intersectedEl || this.mouseDownEl !== this.intersectedEl) { return; }
    this.twoWayEmit(EVENTS.CLICK);
  },

  /**
   * Handle intersection.
   */
  onIntersection: function (evt) {
    var self = this;
    var cursorEl = this.el;
    var intersectedEl = evt.detail.els[0];  // Grab the closest.
    var intersection;
    var index;

    // Select closest object, excluding the cursor.
    index = evt.detail.els[0] === cursorEl ? 1 : 0;
    intersection = evt.detail.intersections[index];
    intersectedEl = evt.detail.els[index];

    // If cursor is the only intersected object, ignore the event.
    if (!intersectedEl) { return; }

    // Already intersecting this entity.
    if (this.intersectedEl === intersectedEl) {
      this.intersection = intersection;
      return;
    }

    // Unset current intersection.
    if (this.intersectedEl) { this.clearCurrentIntersection(); }

    // Set new intersection.
    this.intersection = intersection;
    this.intersectedEl = intersectedEl;

    // Hovering.
    cursorEl.addState(STATES.HOVERING);
    intersectedEl.addState(STATES.HOVERED);
    self.twoWayEmit(EVENTS.MOUSEENTER);
  },

  /**
   * Handle intersection cleared.
   */
  onIntersectionCleared: function (evt) {
    var cursorEl = this.el;
    var intersectedEl = evt.detail.el;

    // Ignore the cursor.
    if (cursorEl === intersectedEl) { return; }

    // Ignore if the event didn't occur on the current intersection.
    if (intersectedEl !== this.intersectedEl) { return; }

    this.clearCurrentIntersection();
  },

  clearCurrentIntersection: function () {
    var cursorEl = this.el;

    // No longer hovering (or fusing).
    this.intersectedEl.removeState(STATES.HOVERED);
    cursorEl.removeState(STATES.HOVERING);
    this.twoWayEmit(EVENTS.MOUSELEAVE);

    // Unset intersected entity (after emitting the event).
    this.intersection = null;
    this.intersectedEl = null;
  },

  /**
   * Helper to emit on both the cursor and the intersected entity (if exists).
   */
  twoWayEmit: function (evtName) {
    var el = this.el;
    var intersectedEl = this.intersectedEl;
    var intersection = this.intersection;
    el.emit(evtName, {intersectedEl: intersectedEl, intersection: intersection});
    if (!intersectedEl) { return; }
    intersectedEl.emit(evtName, {cursorEl: el, intersection: intersection});
  },

  /**
   * Called when a component is removed (e.g., via removeAttribute).
   * Generally undoes all modifications to the entity.
   */
  remove: function () {
    var cursorEl = this.el;

    // Remove laser beam mesh.
    cursorEl.removeObject3D('vive-cursor-mesh');

    // Remove event listeners.
    this.removeEventListeners();

    // Remove raycaster.
    cursorEl.removeAttribute('raycaster');
  },

  /**
   * Called when entity pauses.
   * Use to stop or remove any dynamic or background behavior such as events.
   */
  pause: function () {
    this.removeEventListeners();
  },

  /**
   * Called when entity resumes.
   * Use to continue or add any dynamic or background behavior such as events.
   */
  play: function () {
    this.attachEventListeners();
  }
});
