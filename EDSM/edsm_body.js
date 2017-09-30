/**
 * Returns body data from EDSM API.
 *
 * @param {string} system System name ( Sol ).
 * @param {string} body Body name ( 5 1 A ).
 * @param {string} fields Fields to be returned, separated by comma ",". For a full list of available fields see: https://www.edsm.net/en/api-system-v1#endPointBodies
 * @return Columns with defined fields. Field order => column order.
 * @customfunction
 */
function edsmGetBody(system, body, fields) {

    // for valid types see:
    // https://www.edsm.net/en/api-system-v1#endPointBodies

    // also:
    // fields == 'DUMP_ALL_FIELDS' will dump all available fields (This is a TODO)

    // also:
    // materials return is formatted. It returns 25 columns with material %.

    // in the future:
    // rings, stations, factions, etc?
   
    //Concat System and EDSM URL - Bodies
    var edsmBodyAPI = "https://www.edsm.net/api-system-v1/bodies?systemName=";
        edsmBodyAPI += encodeURI(system);
   
    //Concat Raw System and Body
    var systemBody = system + " " + body;

    // This is a slug used to compare names (get rid of all spaces and turn all chars into lowercase)
    var systemBodySlug = systemBody.replace(' ', '').toLowerCase();

    // Let's get the JSON data from EDSM
    var response = UrlFetchApp.fetch(edsmBodyAPI, {'muteHttpExceptions': true});
    var JSONData = JSON.parse(response.getContentText());
    
    // Now let's prep the fields argument, it's a string of fieldnames separated by commas, so...
    // Get rid of special characters -> I should really use a regexp here. Buuuut, I'm too lazy. ;)
    var fieldsArray = fields.replace(' ', '').replace('[','').replace(']','');

        //Split string into array by commas
        fieldsArray = fieldsArray.split(',');

    // This is our body.
    var JSONbody = null;
    
    // Loop over all the bodies in JSON reply and get our body
    for(var i=0; i<JSONData.bodies.length; i++) {

        var loopBodySlug = JSONData.bodies[i].name.replace(' ','').toLowerCase();
        if( loopBodySlug == systemBodySlug ) {
            // Got it.
            JSONbody = JSONData.bodies[i];
        }

    }

    // Allright, we got everything we need prepped. Let's generate the output based on fields input.
    // Our output cointainer
    var returnColumns = [];

    // If we found a body
    if(JSONbody) {

        // FOR each field requested.
        for(var i=0; i<fieldsArray.length; i++) {
            // fieldsArray[i] is the field name
    
            if( fieldsArray[i] == 'materials' ) {
                // This field has special formatting.
    
                // Array of existing materials, this will need to be updated when new materials
                // are introduced. Or pulled from some API..
                var availableMats = ["Antimony", "Arsenic", "Cadmium", "Carbon", "Chromium", "Germanium", "Iron", "Manganese", "Mercury", "Molybdenum", "Nickel", "Niobium", "Phosphorus", "Polonium", "Ruthenium", "Selenium", "Sulphur", "Technetium", "Tellurium", "Tin", "Tungsten", "Vanadium", "Yttrium", "Zinc", "Zirconium"];
            
                // Our final values array (we return this)
                // This is a hack, we create an empty array of the same length as availableMats
                // and then fill it all with zeroes.
                var matValues = Array.apply(null, Array(availableMats.length)).map(Number.prototype.valueOf,0);
            
                var materials = JSONbody.materials;

                // Since sys.bodies[i].materials is an object with unknown number of mats inside,
                // we'll loop over each own property of the object
                for (var property in materials) {
            
                    // It has to be a custom property (not something from Object)
                    if (materials.hasOwnProperty(property)) {
                        // Inside this IF:
                        // property is the key name, ex. "Iron", "Tin", etc.
                        // materials[property] (Don't even ask) is value.
            
                        // Let's now find the index at which our property sits
                        if( availableMats.indexOf(property) >= 0 ){
            
                            // If the property is in array, we get its index
                            // Since we have our matValues array same length as our availableMats
                            // array, we know that for example matValues[3] is supposed to be Carbon
                            matValues[availableMats.indexOf(property)] = materials[property];
            
                        } else {
                            // We have a material that has not been present in our
                            // original availableMats array. Whoopsie!
                            // We can do something here, for now it's just for this comment.
                        }
                    }
                }


                // Format our materials (THIS SHOULD BE IN ANOTHER FUNCTION);
                // ----------------------------------------------------------------------------------------------------- END
    
                // Add them to the array of columns
                returnColumns = returnColumns.concat(matValues);
                       
            } else if(fieldsArray[i].length > 0) {
                // This has standard formatting
    
                if(typeof JSONbody[ fieldsArray[i] ] !== 'undefined') {
                    // If we have a field, we append it to the array. It will appear as a column in google docs.
                    returnColumns.push( JSONbody[ fieldsArray[i] ] );
                } else {
                    returnColumns.push( 'There is no field named: "'+fieldsArray[i]+'"!' );
                }
    
            }
    
        }

        return [returnColumns];

    } else {
        return ["No body found!"]
    }

}