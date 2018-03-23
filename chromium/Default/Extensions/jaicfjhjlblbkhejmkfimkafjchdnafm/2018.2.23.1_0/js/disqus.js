chrome.storage.sync.get(function(items) {

	var style = document.createElement('link');
	style.setAttribute("type", "text/css");
	style.setAttribute("rel", "stylesheet");
	style.setAttribute("href", 'https://ke.pilar.moe/api/v2/disqusTags');
	document.head.appendChild(style);

});
