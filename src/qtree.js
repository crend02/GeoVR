/** functions to modify the qtree */

//insert object into qtree
export function insertQTree(element, point) {
    let size = getsize(element);
    qt.put({ 'x': point.x, 'y': point.z, 'w': size.x, 'h': size.z, 'string': element });
    console.log("Qtree:" + qtree);
}

//remove an object from qtree
export function removeFromQTree(element, point) {
    let size = getsize(element);
    qt.remove({ 'x': point.x, 'y': point.z, 'w': size.x, 'h': size.z, 'string': element });
}

//update an object in the qtree
export function updateQTree(element, oldpoint, newpoint) {
    let size = getsize(element);
    let result = qt.update({ 'x': oldpoint.x, 'y': oldpoint.z, 'w': size.x, 'h': size.z, 'string': element }, { 'x': newpoint.x, 'y': newpoint.z });
    console.log("update object: " + result);
}

//check for elements at a certain position
// returns an array of matching objects
export function checkQTree(element, point) {
    let size = getsize(element);
    let result = qt.get({ 'x': point.x, 'y': point.z, 'w': size.x, 'h': size.z })
    return result;
}

export function getsize(element) {
	console.log("call");
    let bbox = new THREE.Box3().setFromObject(element.object3D);
    let width = Math.abs(bbox.max.x - bbox.min.x);
    let depth = Math.abs(bbox.max.z - bbox.min.z);
    return { 'x': width, 'z': depth };
}