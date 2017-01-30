/** functions to modify the qtree */

//insert object into qtree
export function insertQTree(qt, element, point) {
    let size = getsize(element);
    qt.put({ 'x': point.x, 'y': point.z, 'w': size.x, 'h': size.z, 'string': element });
    console.log("Qtree:" + qt);
}

//remove an object from qtree
export function removeFromQTree(qt, element, point) {
    let size = getsize(element);
    qt.remove({ 'x': point.x, 'y': point.z, 'w': size.x, 'h': size.z, 'string': element });
}

//check for elements at a certain position
// returns an array of matching objects
export function checkQTree(qt, element, point) {
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