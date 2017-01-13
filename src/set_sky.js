/* controls the background for the image tour */

let cachedGridhelperConf = null;

/* toggle modes */
// need to wait until the DOM is ready for attaching stuff
document.addEventListener("DOMContentLoaded", function(event) {
	document.getElementById('teleport-ctrl').addEventListener('click', function(ev) {
		const scene = document.querySelector('a-scene')
		const buildingview = document.getElementById('buildingview')
		const imageview = document.getElementById('imageview')

		if (buildingview.getAttribute('visible')) {
			// enable imageview
			buildingview.setAttribute('visible', 'false');
			imageview.setAttribute('visible', 'true');
			cachedGridhelperConf = scene.getAttribute('gridhelper');
			scene.removeAttribute('gridhelper');
		} else {
			// enable buidlingview
			buildingview.setAttribute('visible', 'true');
			imageview.setAttribute('visible', 'false');
			scene.setAttribute('gridhelper', cachedGridhelperConf);
		}
	});
});

AFRAME.registerComponent('set-sky', {
	schema: { default: '' },
	init() {
		let sky = document.getElementById('image-sky');
		const entityList = document.querySelectorAll('.imagegallery');
		const opacity_array = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0];

		this.el.addEventListener('click', () => {
			var that = this;
			function opacityTimeoutScaledSky1(i) {
				setTimeout(function () {
					sky.setAttribute('opacity', opacity_array[i]);

					if (sky.getAttribute("opacity") === '0') {
						sky.setAttribute('src', that.data);
						//sky.setAttribute('opacity', '1');
						backloop();
					}

				}, 50 * i);
			};

			function opacityTimeoutScaledSky2(j) {
				setTimeout(function () {
					sky.setAttribute('opacity', j);
				}, 500 * j);

			};

			function backloop() {
				for (var j = opacity_array.length; j > 0; j--) {
					opacityTimeoutScaledSky2(opacity_array[j - 1]);
				}
			};

			switch (this.el.parentElement.id) {
				case 'images_start':
					for (var i = 0; i < opacity_array.length; ++i) {
						opacityTimeoutScaledSky1(i);
					}
					this.el.parentElement.setAttribute('visible', 'false');
					if (this.el.id === 'rm') {
						entityList[1].setAttribute('visible', 'true');
					} else {
						entityList[7].setAttribute('visible', 'true');
					}

					break;
				case 'images_2':
					for (var i = 0; i < opacity_array.length; ++i) {
						opacityTimeoutScaledSky1(i);
					}
					sky.setAttribute('src', this.data);
					this.el.parentElement.setAttribute('visible', 'false');
					if (this.el.id === 'rb') {
						entityList[2].setAttribute('visible', 'true');
					} else if (this.el.id === 'rf') {
						entityList[0].setAttribute('visible', 'true');
					} else {
						entityList[6].setAttribute('visible', 'true');
					}
					break;
				case 'images_3':
					for (var i = 0; i < opacity_array.length; ++i) {
						opacityTimeoutScaledSky1(i);
					}
					sky.setAttribute('src', this.data);
					this.el.parentElement.setAttribute('visible', 'false');
					if (this.el.id === 'cb') {
						entityList[3].setAttribute('visible', 'true');
					} else {
						entityList[1].setAttribute('visible', 'true');
					}
					break;
				case 'images_4':
					for (var i = 0; i < opacity_array.length; ++i) {
						opacityTimeoutScaledSky1(i);
					}
					sky.setAttribute('src', this.data);
					this.el.parentElement.setAttribute('visible', 'false');
					if (this.el.id === 'rb') {
						entityList[2].setAttribute('visible', 'true');
					} else {
						entityList[4].setAttribute('visible', 'true');
					}
					break;
				case 'images_5':
					for (var i = 0; i < opacity_array.length; ++i) {
						opacityTimeoutScaledSky1(i);
					}
					sky.setAttribute('src', this.data);
					this.el.parentElement.setAttribute('visible', 'false');
					if (this.el.id === 'cb') {
						entityList[3].setAttribute('visible', 'true');
					} else {
						entityList[5].setAttribute('visible', 'true');
					}
					break;
				case 'images_6':
					for (var i = 0; i < opacity_array.length; ++i) {
						opacityTimeoutScaledSky1(i);
					}
					sky.setAttribute('src', this.data);
					this.el.parentElement.setAttribute('visible', 'false');
					if (this.el.id === 'lb') {
						entityList[4].setAttribute('visible', 'true');
					} else if (this.el.id === 'mc') {
						entityList[6].setAttribute('visible', 'true');
					} else {
						entityList[7].setAttribute('visible', 'true');
					}
					break;
				case 'images_7':
					for (var i = 0; i < opacity_array.length; ++i) {
						opacityTimeoutScaledSky1(i);
					}
					sky.setAttribute('src', this.data);
					this.el.parentElement.setAttribute('visible', 'false');
					if (this.el.id === 'rm') {
						entityList[1].setAttribute('visible', 'true');
					} else {
						entityList[5].setAttribute('visible', 'true');
					}
					break;
				case 'images_8':
					for (var i = 0; i < opacity_array.length; ++i) {
						opacityTimeoutScaledSky1(i);
					}
					sky.setAttribute('src', this.data);
					this.el.parentElement.setAttribute('visible', 'false');
					if (this.el.id === 'rf') {
						entityList[0].setAttribute('visible', 'true');
					} else {
						entityList[5].setAttribute('visible', 'true');
					}
					break;
			}
		});
	}
});
