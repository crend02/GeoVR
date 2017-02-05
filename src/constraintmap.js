/* global AFRAME, THREE */

/**
 * constraintMap maintains the state of the currently placed
 * objects in the horizontal XZ plane.
 * its based on a 2D quadtree datastructure and is used to
 * verify constraints for placing objects.
 */

import QuadTree from 'simple-quadtree'
import { get2DBounds } from './helpers.js'

const qt = QuadTree(-75, -75, 150, 150);

const constraintMap = {
  // insert object into qtree
  insert(element, position) {
    const bounds = get2DBounds(element, 0, position);
    bounds.el = element;
    return qt.put(bounds);
  },

  // remove an object from qtree
  remove(element, position) {
    const bounds = get2DBounds(element, 0, position);
    bounds.el = element;
    return qt.remove(bounds);
  },

  // check for elements at a certain position
  // returns an array of matching objects
  check(element, padding = 0) {
    // simple-quadtree padding doesnt work. do it manually:
    const bounds = get2DBounds(element, padding);
    return qt.get(bounds);
  }
}

export default constraintMap
