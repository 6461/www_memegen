"use strict";

if (!(Modernizr.arrow && Modernizr.svg && Modernizr.json)) {
	var el = document.getElementById('app');
	el.innerHTML = '<div class="card-panel white-text red darken-2">This app requires support for JavaScript arrow functions, SVG graphics, and JSON functions. Please upgrade to a modern browser.</div>';
} else {
	console.log('All features are supported.');
}
