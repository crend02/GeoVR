AFRAME.registerComponent('set-sky', {
	schema: { default: '' },
	init() {
		let sky = document.querySelector('a-sky');
		const entityList = document.querySelectorAll('a-entity');
		const sky_all = document.querySelectorAll('a-sky');
		const opacity_array = [1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1, 0];

		this.el.addEventListener('click', () => {
			var that = this;
			function opacityTimeoutScaledSky1(i) {
				setTimeout(function () {
					sky.setAttribute('opacity', opacity_array[i]);
					console.log("opacity:" + sky.getAttribute("opacity"));

					if (sky.getAttribute("opacity") === '0') {
						console.log("change pic");
						console.log(that.data);
						sky.setAttribute('src', that.data);
						//sky.setAttribute('opacity', '1');
						backloop();
					}

				}, 50 * i);
			};

			function opacityTimeoutScaledSky2(j) {
				setTimeout(function () {
					console.log("timeout2:" + j);
					sky.setAttribute('opacity', j);
					console.log("backopacity:" + sky.getAttribute("opacity"));
				}, 500 * j);

			};

			function backloop() {
				console.log("Backward loop");
				for (var j = opacity_array.length; j > 0; j--) {
					opacityTimeoutScaledSky2(opacity_array[j - 1]);
					console.log(opacity_array[j - 1]);
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