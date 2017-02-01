/**
 * constraintMap maintains the state of the currently placed
 * objects in the horizontal XZ plane.
 * its based on a 2D quadtree datastructure and is used to
 * verify constraints for placing objects.
 */

import QuadTree from 'simple-quadtree';

const qt = QuadTree(-75, -75, 150, 150);

// returns the position and dimensions of the element
function get2DBounds(element) {
  // create a box from the elements object3D, and use its
  // bounds for coordinates & dimensions on the XZ-plane
  // NOTE! these x,y coords are the objects actual edges,
  // not its origin as specified in aframe `position` attribute.

  const bbox = new THREE.Box3().setFromObject(element.object3D);
  return {
    x: bbox.min.x,
    y: bbox.min.z,
    w: Math.abs(bbox.max.x - bbox.min.x),
    h: Math.abs(bbox.max.z - bbox.min.z)
  };
}

// returns the type of an element via its mixin
function getType(element) {
  return el.getAttribute('mixin');
}

const constraintMap = {
  quadTree: qt,

  // insert object into qtree
  insert(element) {
    const bounds = get2DBounds(element);
    bounds.el = element;
    qt.put(bounds);
  },

  // remove an object from qtree
  remove(element) {
    const bounds = get2DBounds(element);
    bounds.el = element;
    qt.remove(bounds);
  },

  // check for elements at a certain position
  // returns an array of matching objects
  check(element, padding = 0) {
    // TODO: padding doesnt work?
    return qt.get(get2DBounds(element), padding);
  }
}

export default constraintMap

// check element against list of constraints and neighbours
export function checkConstraints(element, neighbours, constraints) {
  return true;
}
