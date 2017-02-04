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
  // NOTE! the x,y coords specify the objects origin, not its actual edges.

  const bbox = new THREE.Box3().setFromObject(element.object3D);
  return {
    x: position.x - padding,
    y: position.z - padding,
    w: Math.abs(bbox.max.x - bbox.min.x) + 2 * padding,
    h: Math.abs(bbox.max.z - bbox.min.z) + 2 * padding
  };
}
