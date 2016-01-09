(function() {
	addEventListener('load', letsRoll);

	function letsRoll() {
		var imageLinks = document.querySelectorAll('a.image');

		Array.prototype.forEach.call(imageLinks, hijackClick);

		var viewer = createViewer();

		var showing = false;
		var next = null, previous = null;

		function show(link, e) {
			showing = true;
			viewer.querySelector('img').src = link.href;
			viewer.style.display = 'flex';
			clickAnimation(e, 0);
			setTimeout(function() {
				clickAnimation(e, '200');
			}, 15);

			if(link.previousElementSibling && link.previousElementSibling.className == 'image')
				previous = link.previousElementSibling;
			if(link.nextElementSibling && link.nextElementSibling.className == 'image')
				next = link.nextElementSibling;

			viewer.focus();
		}

		function hide(e) {
			showing = false;
			clickAnimation(e, 0);
			previous = next = null;
		}

		function hijackClick(link) {
			link.addEventListener('click', function(e) {
				if(e.which != 1)
					return;
				show(link, e);
				e.preventDefault();
			});
		}

		function clickAnimation(mouseEvent, targetPercent) {
			var x = mouseEvent ? mouseEvent.clientX : window.innerWidth/2;
			var y = mouseEvent ? mouseEvent.clientY : window.innerHeight / 2;
			var rule = "circle(PCT% at Xpx Ypx)".replace('PCT', targetPercent)
				.replace('X', x)
				.replace('Y', y);

			if('clipPath' in viewer.style)
				viewer.style.clipPath = rule;

			if('webkitClipPath' in viewer.style)
				viewer.style.webkitClipPath = rule;

			if(!viewer.style.clipPath && !viewer.style.webkitClipPath)
				viewer.style.opacity = targetPercent;
		}

		function createViewer() {
			var viewer = document.createElement('div');
			viewer.id = 'image-viewer';
			document.body.appendChild(viewer);
			viewer.addEventListener('click', hide);
			viewer.style.display = 'none';
			
			var img = document.createElement('img');
			viewer.appendChild(img);

			viewer.addEventListener('transitionend', function(ae) {
				if(!showing)
					viewer.style.display = 'none';
			});

			viewer.tabIndex = 0;
			viewer.addEventListener('keydown', handleImageViewerKey);
			return viewer;
		}

		function handleImageViewerKey(keyEvent) {
				switch(keyEvent.which) {
					case 37:
						if(previous)
							show(previous);
						break;
					case 39:
						if(next)
							show(next);
						break;
					case 27:
						hide();
						break;
					default: break; //sometimes jslint sucks
				}
			}
	}
})();
