/* global AFRAME, THREE */

/**
 * constraintMap maintains the state of the currently placed
 * objects in the horizontal XZ plane.
 * its based on a 2D quadtree datastructure and is used to
 * verify constraints for placing objects.
 */

import QuadTree from 'simple-quadtree'
import constraints from './constraints.json'

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

// returns the type of an element via its first mixin
function getType(element) {
  return element.getAttribute('mixin').split(' ')[0];
}

const constraintMap = {
  // insert object into qtree
  insert(element, position) {
    const bounds = get2DBounds(element, position);
    checkConstraints(element);
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
    // TODO: padding doesnt work?
    return qt.get(get2DBounds(element), padding);
  }
}

export default constraintMap

// check element against list of constraints and neighbours
// UNTESTED!
export function checkConstraints(element) {
  const constr = constraints[getType(element)];
  const neighbours = constraintMap.check(element, 2);
  const self = constraintMap.check(element, 0);
  const neighbourCounts = {};
  const selfCounts = {};

  // get counts of object types on self and neighbours
  for(const n of neighbours) {
    const type = getType(n.el);
    neighbourCounts[type] = neighbourCounts[type] ? neighbourCounts[type] + 1 : 1;
  }
  for(const n of self) {
    const type = getType(n.el);
    selfCounts[type] = selfCounts[type] ? selfCounts[type] + 1 : 1;
    // remove duplicate counts in self from neighbours, bc it's a subset
    if (neighbourCounts[type]) neighbourCounts[type] -= 1;
  }

  console.log('neighbours:', neighbourCounts);
  console.log('self:', selfCounts);
  let selfValid = true;
  let neighboursValid = true;

  // check each constraint type
  // constraint value for a type marks the count. if 0, it's applied to `self`.
  for (const type in constr.requires) {
    if (constr.requires[type] === 0 && selfCounts[type] == 0) {
      selfValid = false;
      break;
    } else if (constr.requires[type] > neighbourCounts[type]) {
      neighboursValid = false;
      break;
    }
  }

  if (!selfValid || !neighboursValid) return false;

  // FIXME: differentiate self & neighbour constraint (0 value)
  for (const type in constr.forbids) {
    if (selfCounts[type]) {
      selfValid = false;
      break;
    }
    if (neighbourCounts[type]) {
      neighboursValid = false;
      break;
    }
  }

  return selfValid && neighboursValid;
}
