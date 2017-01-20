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
