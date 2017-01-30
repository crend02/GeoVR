/** functions to modify the qtree */

//insert object into qtree
export function insertQTree(element, point) {
    size = getsize(element);
    qt.put({ 'x': point.x, 'y': point.z, 'w': size.x, 'h': size.z, 'string': element });
    console.log("Qtree:" + qtree);
}

//remove an object from qtree
export function removeFromQTree(element, point) {
    size = getsize(element);
    qt.remove({ 'x': point.x, 'y': point.z, 'w': size.x, 'h': size.z, 'string': element });
}

//update an object in the qtree
export function updateQTree(element, oldpoint, newpoint) {
    size = getsize(element);
    result = qt.update({ 'x': oldpoint.x, 'y': oldpoint.z, 'w': size.x, 'h': size.z, 'string': element }, { 'x': newpoint.x, 'y': newpoint.z });
    console.log("update object: " + result);
}

//check for elements at a certain position
// returns an array of matching objects
export function checkQTree(element, point) {
    size = getsize(element);
    result = qt.get({ 'x': point.x, 'y': point.z, 'w': size.x, 'h': size.z })
    return result;
}

export function getsize(element) {
    bbox = new THREE.Box3().setFromObject(element.object3D);
    width = Math.abs(bbox.max.x - bbox.min.x);
    depth = Math.abs(bbox.max.z - bbox.min.z);
    return { 'x': width, 'z': depth };
}