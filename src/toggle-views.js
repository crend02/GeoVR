import AFRAME from './aframe-master.js'

/* toggle modes on triggerdown */
AFRAME.registerComponent('toggle-views', {
  schema: { 
    view1: { type: 'selector', default: '#buildingview' },
    view2: { type: 'selector', default: '#imageview' },
	view3: { type: 'selector', default: '#mview'}
  },

  init () {
  	
    this.el.addEventListener('triggerdown', (ev) => {
      if (this.data.view1.getAttribute('visible')) {  
      	//let cam = document.getElementById('cam');
		
		// get current and new position of camera
		let cam = this.el.sceneEl.camera.el;
		this.camPositionBuildingView = cam.getAttribute('position');
		
		let camPosition = new THREE.Vector3().copy(this.camPositionBuildingView);
		let newCamPosition = new THREE.Vector3(0, 1.6, 0);

		// update cam pos
      	cam.setAttribute('position', newCamPosition.toArray().join(' '));
		
		// Find the hands and move them proportionally
		var hands = document.querySelectorAll('a-entity[tracked-controls]');
		for (var i = 0; i < hands.length; i++) {
		  var position = hands[i].getAttribute('position');
		  var pos = new THREE.Vector3().copy(position);
		  var diff = camPosition.clone().sub(pos);
		  var newPosition = newCamPosition.clone().sub(diff);
		  hands[i].setAttribute('position', newPosition.toArray().join(' '));
		}
		
		// remove teleport component
		document.getElementById('teleport-ctrl').removeAttribute('teleport-controls');
		document.getElementById('cursor-ctrl').removeAttribute('vive-place-objects');
		document.getElementById('cursor-ctrl').removeAttribute('vive-object-palette');
		
        this.data.view1.setAttribute('visible', 'false');
        this.data.view2.setAttribute('visible', 'true');
		this.data.view3.setAttribute('visible', 'false');
      } else {
		  
		// reset to previous camera position from building view
		let cam = this.el.sceneEl.camera.el;
		let currentCamPosition = new THREE.Vector3().copy(cam.getAttribute('position'));
		let cachedCamPosition = new THREE.Vector3().copy(this.camPositionBuildingView);

		cam.setAttribute('position', this.camPositionBuildingView);
		
		// Find the hands and move them proportionally
		var hands = document.querySelectorAll('a-entity[tracked-controls]');
		for (var i = 0; i < hands.length; i++) {
		  var position = hands[i].getAttribute('position');
		  var pos = new THREE.Vector3().copy(position);
		  var diff = currentCamPosition.clone().sub(pos);
		  var newPosition = cachedCamPosition.clone().sub(diff);
		  hands[i].setAttribute('position', newPosition.toArray().join(' '));
		}

		// readd the teleport comonent
		document.getElementById('teleport-ctrl').setAttribute('teleport-controls', 'curveShootingSpeed: 10');
		document.getElementById('cursor-ctrl').setAttribute('vive-place-objects', 'drawTarget: #planningarea; placedObjectContainer: #buildingview');
		document.getElementById('cursor-ctrl').setAttribute('vive-object-palette', 'values: tree, greenarea, bench, street, footpath, parkingarea, privatebuilding, privatebuilding2, store, store2, publicbuilding; target: vive-place-objects/placedObjectMixin');
		
        this.data.view1.setAttribute('visible', 'true');
        this.data.view2.setAttribute('visible', 'false');
		this.data.view3.setAttribute('visible', 'true');
      }
    });

  }
});
