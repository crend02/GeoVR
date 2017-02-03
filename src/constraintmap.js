/* global AFRAME, THREE */

/**
 * constraintMap maintains the state of the currently placed
 * objects in the horizontal XZ plane.
 * its based on a 2D quadtree datastructure and is used to
 * verify constraints for placing objects.
 */

import QuadTree from 'simple-quadtree'

const qt = QuadTree(-75, -75, 150, 150);

// returns the position and dimensions of the element
function get2DBounds(element, position = element.getAttribute('position')) {
  // create a box from the elements object3D, and use its
  // bounds for coordinates & dimensions on the XZ-plane
  // NOTE! the x,y coords specify the objects origin,
  // not its actual edges.

  const bbox = new THREE.Box3().setFromObject(element.object3D);
  return {
    x: position.x,
    y: position.z,
    w: Math.abs(bbox.max.x - bbox.min.x),
    h: Math.abs(bbox.max.z - bbox.min.z)
  };
}

const constraintMap = {
  // insert object into qtree
  insert(element, position) {
    const bounds = get2DBounds(element, position);
    bounds.el = element;
    return qt.put(bounds);
  },

  // remove an object from qtree
  remove(element, position) {
    const bounds = get2DBounds(element, position);
    bounds.el = element;
    return qt.remove(bounds);
  },

  // check for elements at a certain position
  // returns an array of matching objects
  check(element, padding = 0) {
    // simple-quadtree padding doesnt work. do it manually:
    const bounds = get2DBounds(element);
    bounds.x -= padding / 2;
    bounds.y -= padding / 2;
    bounds.w += padding;
    bounds.h += padding;
    return qt.get(bounds);
  }
}

export default constraintMap
