# Applying to your sheet:
In your Google Docs sheet, go to Tools -> Script Editor, and paste the contents of your selected files there.

## EDSM Coords:


*Returns coordinates of supplied systems.*


@param {string} systems A single system name OR a range of system names (A1:A20). Has to be one dimentional.
@param {string} separator String used to separate X Y Z coords. Default " / ".
@return Rows of coordinates.


#### Example usage:

Get coordinates for single system:
```
=edsmGetCoords(A2)
```

Get coordinates for a range of cells (Recommended):
```
=edsmGetCoords(A2:A10)
```

Using custom separator:
```
=edsmGetCoords(A2; " : ")
```

IMPORTANT: Passing range of cells to this function is preferable from using many instances of it.

## EDSM Body:


*Returns body data from EDSM API. Available fields passed can be found in EDSM body API:*
[EDSM Body API](https://www.edsm.net/en/api-system-v1#endPointBodies).

@param {string} system System name ( Sol ).
@param {string} body Body name ( 5 1 A ).
@param {string} fields Fields to be returned, separated by comma ",". For a full list of available fields see: https://www.edsm.net/en/api-system-v1#endPointBodies
@return Columns with defined fields. Field order => column order.


#### Fields (from EDSM):

```javascript
{
    id                              : 219074,
    name                            : "HD 43193 A",
    type                            : "Star",
    subType                         : "B (Blue-White) Star",
    distanceToArrival               : 0,
    isMainStar                      : true,
    isScoopable                     : true,
    age                             : 760,
    absoluteMagnitude               : 0.443283,
    solarMasses                     : 14.5625,
    solarRadius                     : 5.3612057397555715,
    surfaceTemperature              : 30995,
    orbitalPeriod                   : 277.5355324074074,
    semiMajorAxis                   : 0.4615586345240675,
    orbitalEccentricity             : 0.275417,
    orbitalInclination              : 73.390816,
    argOfPeriapsis                  : 23.460678,
    rotationalPeriod                : 2.2797341579861112,
    rotationalPeriodTidallyLocked   : false,
    materials						: [array of materials]
}
```


#### Example usage:

Get single field from a body:

```
=edsmGetBody(A2;B2;"subType")

// "B (Blue-White) Star"
```

Get multiple fields for one body:

```
// Notice no spaces between field names
=edsmGetBody(A2;B2;"type,subType,surfaceTemperature,distanceToArrival")

// Star   B (Blue-White) Star   30995   0
```

Get materials for body:

```
=edsmGetBody(A2;B2;"materials")

// 25 columns of alphabetical materials:

```

Materials order:
```javascript

[
	"Antimony",
	"Arsenic",
	"Cadmium",
	"Carbon",
	"Chromium",
	"Germanium",
	"Iron", 
	"Manganese", 
	"Mercury", 
	"Molybdenum", 
	"Nickel", 
	"Niobium", 
	"Phosphorus", 
	"Polonium", 
	"Ruthenium", 
	"Selenium", 
	"Sulphur", 
	"Technetium", 
	"Tellurium", 
	"Tin", 
	"Tungsten", 
	"Vanadium", 
	"Yttrium", 
	"Zinc", 
	"Zirconium"
];

```