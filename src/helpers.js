/* general use helper functions */

/**
 * @desc clips a 3D coordinate to a grid with interval `gridSize`
 * @param point {THREE.Vector3}
 * @param gridSize {Number}
 * @returns {THREE.Vector3} the clipped coordinate
 */
export function snapToGrid (point, gridSize = 1) {
  return {
    x: gridSize * Math.round(point.x / gridSize),
    y: gridSize * Math.round(point.y / gridSize),
    z: gridSize * Math.round(point.z / gridSize)
  }
}

/* fixed modulo, which returns positive values for negative inputs */
export function modulo (v, n) {
  return (v % n + n) % n;
}

/**
 * calculate the bounds of the element on the XZ-plane
 * @param element {DOMNode} of an aframe entity with geometry
 * @param padding {Number} padding applied in each direction
 * @param position {THREE.Vec3} overrides the position of the object.
 * @returns {Object} { x: Number, y: Number, w: Number, h: Number } the (buffered) bounds
 * */
export function get2DBounds(element, padding = 0, position = element.getAttribute('position')) {
  // create a box from the elements object3D, and use its
  // bounds for coordinates & dimensions on the XZ-plane
  // NOTE! the x,y coords specify the objects origin shifted
  // by half its dimensions, to be compatible with the qtree
  // implementation which considers the objects edges for overlaps.

  const bbox = new THREE.Box3().setFromObject(element.object3D);
  const width  = Math.abs(bbox.max.x - bbox.min.x);
  const height = Math.abs(bbox.max.z - bbox.min.z);
  return {
    x: position.x - width  / 2 - padding,
    y: position.z - height / 2 - padding,
    w: width  + 2 * padding,
    h: height + 2 * padding
  };
}

// returns the type of an element via its first mixin
export function getElementType(element) {
  return element.getAttribute('mixin').split(' ')[0];
}
