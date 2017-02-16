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
        this.data.view1.setAttribute('visible', 'false');
        this.data.view2.setAttribute('visible', 'true');
		this.data.view3.setAttribute('visible', 'false');
      } else {
        this.data.view1.setAttribute('visible', 'true');
        this.data.view2.setAttribute('visible', 'false');
		this.data.view3.setAttribute('visible', 'true');
      }
    });
  }
});
