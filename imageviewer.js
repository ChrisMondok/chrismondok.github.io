(function() {
	addEventListener('load', letsRoll);

	function letsRoll() {
		var imageLinks = document.querySelectorAll('a.image');

		Array.prototype.forEach.call(imageLinks, hijackClick);

		var viewer = createViewer();

		var showing = false;

		function show(url, e) {
			//viewer.style.backgroundImage = "url("+url+")";
			showing = true;
			viewer.querySelector('img').src = url;
			viewer.style.display = 'flex';
			clickAnimation(e, 0);
			setTimeout(function() {
				clickAnimation(e, '200%');
			}, 15);
		}

		function hide(e) {
			showing = false;
			clickAnimation(e, 0);
		}

		function hijackClick(el) {
			el.addEventListener('click', function(e) {
				if(e.which != 1)
					return;
				show(el.href, e);
				e.preventDefault();
			});
		}

		function clickAnimation(mouseEvent, targetPercent) {
			var rule = "circle(SIZE at Xpx Ypx)".replace('SIZE', targetPercent).replace('X', mouseEvent.clientX).replace('Y', mouseEvent.clientY);

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
			return viewer;
		}
	}
})();
