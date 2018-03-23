document.addEventListener('DOMContentLoaded', function() {

	if (parent !== window) {

		function rapidVideoShit() {

			var checkForLink = setInterval(function() {

				var videoElement = document.querySelector('video source');

				if (videoElement && videoElement.src) {

					console.debug('RapidVideo Frame: URL found! Sending to parent window.');
					clearInterval(checkForLink);

					console.log(videoElement);

					// parent.postMessage(['RapidVideoURL', playerInstance.getPlaylist()[0].sources.reverse()], 'http://kissanime.ru');
					parent.postMessage(['RapidVideoURL', videoElement.src], 'http://kissanime.ru');

				} else {

					console.debug('RapidVideo Frame: URL not yet loaded!');

				}

			}, 100);

		}

		var script = document.createElement('script');
		script.appendChild(document.createTextNode('(' + rapidVideoShit + ')();'));
		(document.head || document.body).appendChild(script);

	}

});