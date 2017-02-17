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
      	let camPosition = document.getElementById('cam');
      	console.log(camPosition);

      	camPosition.setAttribute('position', '0 1.6 0');
      	 var hands = document.querySelectorAll('a-entity[tracked-controls]');
      	 console.log(hands);


        this.data.view1.setAttribute('visible', 'false');
        this.data.view2.setAttribute('visible', 'true');
		this.data.view3.setAttribute('visible', 'false');
      } else {

      	//todo controller at camPosition
      	let camPosition = document.getElementById('cam');
      	console.log(camPosition);
      	camPosition.setAttribute('position', '0 1.6 0');


        this.data.view1.setAttribute('visible', 'true');
        this.data.view2.setAttribute('visible', 'false');
		this.data.view3.setAttribute('visible', 'true');
      }
    });
  }
});
