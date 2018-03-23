document.addEventListener('DOMContentLoaded', function() {

	if (parent !== window) {

		function streamangoShit() {

			var checkForLink = setInterval(function() {

				if (srces) {
					
					console.debug('Streamango Frame: URL found! Sending to parent window.');
					clearInterval(checkForLink);

					var urls = srces.filter(function(item) {
						return item.type === 'video/mp4'
					});

					parent.postMessage(['StreamangoURL', urls], 'http://kissanime.ru');

				} else {

					console.debug('Streamango Frame: URL not yet loaded!');

				}

			}, 100);

		}

		var script = document.createElement('script');
		script.appendChild(document.createTextNode('(' + streamangoShit + ')();'));
		(document.head || document.body).appendChild(script);

	}

});