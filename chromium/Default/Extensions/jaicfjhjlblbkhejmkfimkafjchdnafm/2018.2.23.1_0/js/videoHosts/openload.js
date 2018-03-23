document.addEventListener('DOMContentLoaded', function () {

	if (parent !== window) {

		var checkForLink = setInterval(function() {

			document.querySelector('#videooverlay').click();

			var url = document.querySelector('#streamurl');

			if (url && url.innerText === 'HERE IS THE LINK') {

				console.debug('Openload Frame: URL not yet loaded!');

			} else {

				console.debug('Openload Frame: URL found! Sending to parent window.');

				clearInterval(checkForLink);

				parent.postMessage(['OpenloadURL', window.location.origin + '/stream/' + url.innerText], 'http://kissanime.ru');

			}

		}, 10);

	}

});