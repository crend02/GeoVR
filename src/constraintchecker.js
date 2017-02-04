import { get2DBounds } from './helpers.js'
import constraintMap from './constraintmap.js'
import constraints from './constraints.json'

// returns the type of an element via its first mixin
function getType(element) {
  return element.getAttribute('mixin').split(' ')[0];
}

// takes an array of objects from the quadtree
// and returns a unique array of their types.
function getUniqueTypes(qtEls) {
  return [...new Set( qtEls.map(n => getType(n.el)) )];
}

// takes two arrays of objects from the quadtree,
// and counts their occurences by object-type.
// returns distinct sets from a sub- & superset
// and ignores an element `selfElement`.
function getTypeCounts(subset, superset, selfElement) {
  const counts = {
    subset: {},
    superset: {}
  };

  for(const obj of superset) {
    if (obj.el === selfElement) continue;
    const type = getType(obj.el);
    counts.superset[type] = (counts.superset[type] || 0) + 1;
  }

  for(const obj of subset) {
    // make distinct sets by removing duplicate counts in superset
    if (counts.superset.hasOwnProperty(type)) {
      counts.superset[type] -= 1;
      if (counts.superset[type] === 0) delete counts.superset[type];
    }
    if (obj.el === selfElement) continue;
    const type = getType(obj.el);
    counts.subset[type] = (counts.subset[type] || 0) + 1;
  }

  // if self contains nothgin, add artificial type "empty"
  if (!Object.keys(counts.subset).length) counts.subset["empty"] = 1;

  return counts;
}

// checks a set of rules against a set of object types.
// if `isWhitelist` is true, no objects may be present
// that are not explicitly required.
// returns an array of errors, containing the rules that were not met.
function checkRulesOnObjects(rules, objects, isWhitelist = false) {
  let requiresOneValid = false;
  let errors = [];

  // check each rule
  for (const type in rules) {
    let ruleValid = true;
    if (!requiresOneValid && rules[type] === 'REQUIRES') {
      ruleValid = objects.hasOwnProperty(type);
      requiresOneValid = true;
    } else if (rules[type] === 'REQUIRES_ALL') {
      ruleValid = objects.hasOwnProperty(type);
    } else if (rules[type] === 'FORBIDS') {
      ruleValid = !objects.hasOwnProperty(type);
    }

    if (!ruleValid) errors.push(`${rules[type]} ${type}`);
  }

  if (!isWhitelist) return errors;

  // do a whitelist check: forbid anything that is not required, except 'empty'
  for (const type in objects) {
    if (type !== 'empty' && rules[type] !== 'REQUIRES')
      errors.push(`FORBIDS ${type} (whitelist)`);
  }

  return errors;
}

// check element against list of constraints and adjacentObjs
export default function checkConstraints(element) {
  const rules    = constraints[getType(element)],
    selfObjs     = constraintMap.check(element, -0.01), // buffer must be slightly smaller than
    adjacentObjs = constraintMap.check(element, 0.99);  // gridsize, to avoid overlapping objs

  if (!rules) return { valid: true }; // no constraints for this element defined

  // get types of objects in selfObjs/adjacent cells as object properties
  const { subset: selfCounts, superset: adjacentCounts }
    = getTypeCounts(selfObjs, adjacentObjs, element);

  // check both sets for their respective constraints
  const selfErrors = checkRulesOnObjects(rules.self, selfCounts, true);
  const neighbourErrors = checkRulesOnObjects(rules.adjacent, adjacentCounts);

  /* DEBUG
  showBounds(element, 1);
  console.log('checking %s %O', getType(element), element);
  if (selfErrors.length) console.log('[selfObjs] the following rules are not met:', selfErrors)
  if (neighbourErrors.length) console.log('[adjacentObjs] the following rules are not met:', neighbourErrors)
  else console.log('selfObjs is valid.')
  else console.log('adjacentObjs valid.')
  */

  return {
    valid: !(selfErrors.length || neighbourErrors.length),
    unmetRules: {
      selfObjs: selfErrors,
      adjacent: neighbourErrors
    }
  };
}

// create some visual helpers, showing the bounds of the checked area
// red is self, green is adjacents
function showBounds(element, adjaBuffer = 1) {
  // calculate the buffer manually, assuming aframe sets the origin at the boxes center
  // unlike simple-quadtree.
  const bounds = get2DBounds(element);
  const container = document.getElementById('buildingview');
  const selfRect = createRectangle('#f44', bounds, container);
  bounds.w += 2*adjaBuffer; bounds.h += 2*adjaBuffer;
  const adjaRect = createRectangle('#4f4', bounds, container);

  function createRectangle (color = '#f66', { x, y: z, w, h: d }, container) {
    const rect = document.createElement('a-entity');
    rect.setAttribute('material', { wireframe: true, color });
    rect.setAttribute('geometry', { primitive: 'box', width: w, depth: d, height: 0.2 });
    rect.setAttribute('position', { x, y: 0.1, z });
    container.appendChild(rect);
    setTimeout(() => container.removeChild(rect), 4000);
  };
};

