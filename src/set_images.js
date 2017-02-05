/* controls the background for the image tour */
AFRAME.registerComponent('set-images', {
	schema: { default: '' },
	init() {
		let sky = document.getElementById('image-sky');
		let area = document.getElementById('planningarea');
		let buildings = document.getElementById('buildings');
		let view = document.getElementById('buildingview');
		let floor = document.getElementById('floor');
		
		

		this.el.addEventListener('mouseenter', () => {
			console.log(this.data)
			sky.setAttribute('src', this.data);
			sky.setAttribute('visible', 'true');
			area.setAttribute('visible', 'false')
			buildings.setAttribute('visible', 'false')
			view.setAttribute('visible','false')
			floor.setAttribute('visible', 'false')





				})
		this.el.addEventListener('mouseleave', () => {
			console.log("leave")
			sky.setAttribute('visible', 'false');
			area.setAttribute('visible', 'true')
			buildings.setAttribute('visible', 'true')
			view.setAttribute('visible','true')
			floor.setAttribute('visible', 'true')



		})

	}
})