/**
 * Returns coordinates of supplied systems.
 *
 * @param {string} systems A single system name OR a range of system names (A1:A20). Has to be one dimentional.
 * @param {string} separator String used to separate X Y Z coords. Default " / ".
 * @return Rows of coordinates.
 * @customfunction
 */
function edsmGetCoords(systems, customSeparator) {

	var separator = ' / ';

	// override default separator
	if (typeof customSeparator !== 'undefined') {
		separator = customSeparator;
	}

	// prep data
	var apiPayload = {
		showCoordinates: 1
	}

	if (typeof systems == 'string') {
		// Single system.
		apiPayload['systemName[0]'] = systems;

	} else if (typeof systems == 'object' && typeof systems.length !== 'undefined') {
		// It's an array!

		for (var j = 0; j < systems.length; j++) {
			var key = 'systemName[' + j + ']';
			apiPayload[key] = systems[j][0];
		}

	} else {
		// This is something bad
		return 'Invalid System Range or Value';
	}

	var apiOptions = {
		method: 'post',
		payload: apiPayload
	}

	var response = UrlFetchApp.fetch('https://www.edsm.net/api-v1/systems', apiOptions);
	var JSONsystems = JSON.parse(response.getContentText());

	var output = [];

	for (var i = 0; i < JSONsystems.length; i++) {

		var coordString = JSONsystems[i].coords.x + separator + JSONsystems[i].coords.y + separator + JSONsystems[i].coords.z;

		output.push(coordString);
	}

	return output;

}
