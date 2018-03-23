console.clear();

var enableDevApi = localStorage.getItem('enableDevApi');
var showCaptchaHelper = localStorage.getItem('showCaptchaHelper');

console.log('Captcha Page.');
console.log(`Is iFrame ${window.frameElement ? true : false}.`);

toastr.options = {
	"closeButton": false,
	"debug": false,
	"newestOnTop": false,
	"progressBar": true,
	"positionClass": "toast-bottom-center",
	"preventDuplicates": true,
	"onclick": null,
	"showDuration": "fast",
	"hideDuration": "fast",
	"timeOut": "500",
	"showEasing": "linear",
	"hideEasing": "linear",
	"showMethod": "fadeIn",
	"hideMethod": "fadeOut"
};

var redirectURL = decodeURIComponent(window.location.search).replace('?reUrl=', '') + window.location.hash;

if (redirectURL === 'undefined') redirectURL = '';

var images = [];
var captchaText = [];

$(document).ready(function() {

	if (document.location.search && $('img[src*="/Special/CapImg"]').length) {

		$('head').inject('inline-script', function() {
			$('#formVerify').submit(function() {
				return false;
			});
		});

		images = document.querySelectorAll('img[src*="/Special/CapImg"]');
		var tags = $('[style="font-weight: bold; color: #d5f406"]');
		captchaText = [
			tags[0].textContent.trim(),
			tags[1].textContent.trim()
		];

		var selectedImagesIndex = [];

		$('img[src*="/Special/CapImg"]').click(function() {

			console.log('Selected Image.');

			var imageIndex = $(this).attr('indexValue');
			var arrayIndex = selectedImagesIndex.indexOf(imageIndex);

			if (arrayIndex > -1)
				selectedImagesIndex.splice(arrayIndex);
			else
				selectedImagesIndex.push(imageIndex);

			if (selectedImagesIndex.length === 2) {

				console.log('Selected 2 Images. Sending Request...');

				$.ajax({
					url: '/Special/AreYouHuman2',
					type: 'POST',
					contentType: 'application/x-www-form-urlencoded',
					data: { reUrl: redirectURL, answerCap: selectedImagesIndex.join(',') },
					timeout: 15000,
					success: function(data) {

						if (data.indexOf('Wrong answer.') > -1) {

							toastr.error('Wrong answer! Reloading page...');
							setTimeout(() => location.reload(), 500);

						} else {

							console.log('Captcha Solved.');

							if (window.frameElement) {

								// Retries the captcha every 2 minutes so no matter how long the user takes to proceed
								// to the next/previous episode, the captcha will always be solved.
								setTimeout(() => location.reload(), 120000);
						
							} else {

								toastr.success('Correct! Loading page...');
								location = redirectURL;

							}

						}
					},
					error: function(xhr) {
						if (xhr.statusText === 'timeout') {
							toastr.warning('Request timed out! Reloading page...');
							setTimeout(() => location.reload(), 500);
						}
					}
				});

			}

		});

		if (showCaptchaHelper === 'true') {
			for (var image of images) {
				$(`<a class="copyBase64" href="javascript:void(0)">Copy Base64</a>`).click(function() {
					copyText(getBase64Image($(this).prev()[0]));
				}).insertAfter(image);
			}
		}

	}
	
});

$(window).on('load', function() {

	if (document.location.search && $('img[src*="/Special/CapImg"]').length) {

		if (enableDevApi === 'false' || !enableDevApi) {

			console.log('Attempting to auto solve captcha...');

			chrome.runtime.sendMessage({
				request: {
					method: 'POST',
					// url: 'http://localhost:9999/api/captchaSolver',
					url: 'https://ke.pilar.moe/api/v2/captchaSolver',
					// contentType: 'application/vnd.api.v3+json',
					contentType: 'application/json',
					data: JSON.stringify({ tags: captchaText })
				}
			}, function(data) {

				console.log(data);

				if (!data.success && data.error.status !== 404)
					return console.error('Something happened.');

				var data = data.data.results;

				console.log('Got Some Matches.');

				if (data.length === 0) return;

				console.log('Comparing Images...');

				for (var image of images) {
					var base64 = getBase64Image(image);
					for (entry of data) {
						if (entry.base64 == base64) {
							console.log('Found Image.');
							image.click();
						}
					}
				}

			});

		}
	
	}

});

function getBase64Image(img) {
	var tempImg = document.createElement("img");
	var canvas = document.createElement("canvas");
	var ctx = canvas.getContext("2d");
	tempImg.src = img.src;
	canvas.width = tempImg.width * 0.25;
	canvas.height = tempImg.height * 0.25;
	ctx.drawImage(tempImg, 0, 0, tempImg.width * 0.25, tempImg.height * 0.25);
	var dataURL = canvas.toDataURL("image/png");
	return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function copyText(text) {
	var input = document.createElement('textarea');
	document.body.appendChild(input);
	input.value = text;
	input.focus();
	input.select();
	document.execCommand('Copy');
	input.remove();
}