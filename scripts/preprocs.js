function createP2Source(P2source) {
  var P2sourceClean = P2source.split("\r\n");
  var P2sourceJobs = [];
  var P2sourceSales = [];
  var associate = ["1", "5", "10", "20", "50", "100", "250", "500", "1000", "5000", "10000"]

  for (var i = 0; i < P2sourceClean.length; i++) {
    var temp = P2sourceClean[i].split(",");

    var ind = associate.indexOf( temp[0] );
    if (ind == associate.length-1) {
      var label = associate[ind] + "+";
    } else {
      var label = associate[ind] + "-" + String( parseInt(associate[ind+1])-1);
    }

    P2sourceClean[i] = {
      name:  label,
      jobs:  parseFloat(temp[1])/1000000,
      sales: parseFloat(temp[2])/1000
    }
    P2sourceJobs[i] = {
      category:  label,
      count:  parseFloat(temp[1])/1000000
    }
    P2sourceSales[i] = {
      category:  label,
      count:  parseFloat(temp[2])/1000
    }
  }
  return [P2sourceClean, P2sourceJobs, P2sourceSales];
}

function createP3Source(P3source) {
  var P3sourceClean = P3source.split("\r\n");

  for (var i = 0; i < P3sourceClean.length; i++) {
    var temp = P3sourceClean[i].split(",");

    P3sourceClean[i] = {
      city:  temp[0],
      // y1: [count, countPetite, countMoyen, countLarge, employees, sales,salesPerEmployee]
      // y2: [count, countPetite, countMoyen, countLarge, employees, sales,salesPerEmployee]
      y1: [ parseInt(temp[1]), parseFloat(temp[5]), parseFloat(temp[6]), parseFloat(temp[7]), parseFloat(temp[3]), parseFloat(temp[2]/1000), parseFloat(temp[4])*1000000],
      y2: [ parseInt(temp[1]), parseFloat(temp[5]), parseFloat(temp[6]), parseFloat(temp[7]), parseFloat(temp[3]), parseFloat(temp[2]/1000), parseFloat(temp[4])*1000000]
    }
  }
  return P3sourceClean;
}


function createSourcesMTL(text, SalesCategory, EmployeeCategory) {
   /***** Catégories d'emplois et ventes *****/
  //En millions de dollars
  var SalesCategory = ["0", "0.5", "1.0", "2.5", "5.0", "10", "20", "50", "100", "500", "1000", "9999"];
  var EmployeeCategory = ["1.0", "5.0", "10.0", "20.0", "50.0", "100.0", "250.0", "500.0", "1000.0", "5000.0", "10000.0", "99999.0"];

  var sources = text.split("\r\n"); //À rechanger!!! var sources = text.split("\r\n");
  for (var i = 0; i < sources.length; i++) {

    sources[i] = sources[i].split("[sep]");
    sources[i] = {
        name: sources[i][0],
        address: sources[i][1],
        city: sources[i][2],
        postalCode:sources[i][3],
        sicCode: sources[i][6],
        sicDescription: sources[i][7],
        sicDescriptionfr: sources[i][8],
        WebSite:"https://www.google.ca",
        sales: {
          min: parseFloat(sources[i][9]),
          max: parseFloat(sources[i][10]),
          average: (parseFloat(sources[i][9]) + parseFloat(sources[i][10]))/2,
          category: parseFloat(sources[i][9]) + "-" + parseFloat(sources[i][10])
        },
        employees: {
          min: parseFloat(sources[i][12]),
          max: parseFloat(EmployeeCategory[EmployeeCategory.indexOf(sources[i][12])+1]),
          average: parseInt((parseFloat(sources[i][12])+parseFloat(EmployeeCategory[EmployeeCategory.indexOf(sources[i][12])+1]))/2),
          category: parseFloat(sources[i][12]) + "-" + parseFloat(EmployeeCategory[EmployeeCategory.indexOf(sources[i][12])+1])
        },
        coords: [parseFloat(sources[i][15]),parseFloat(sources[i][16]) ]
      }
  }
  return sources;
}
function createSources(text) {
	/***** Catégories d'emplois et ventes *****/
  //En millions de dollars
  var SalesCategory = ["0", "0.5", "1", "2.5", "5", "10", "20", "50", "100", "500", "1000", "9999"];
 
  var EmployeeCategory = ["1", "5", "10", "20", "50", "100", "250", "500", "1000", "5000", "10000", "99999."];
  var sources = text.split("\r\n");
 
  for (var i = 0; i < sources.length; i++) {

    sources[i] = sources[i].split("[sep]");

    sources[i] = {
    		name: sources[i][0],
    		address: sources[i][1],
    		city: sources[i][2],
    		postalCode:sources[i][3],
    		sicCode: sources[i][6],
    		sicDescription: sources[i][7],
        sicDescriptionfr: sources[i][8],
    		sales: {
    			min: parseFloat(sources[i][9]),
    			max: parseFloat(SalesCategory[SalesCategory.indexOf(sources[i][9])+1]),
    			average: (parseFloat(sources[i][9]) + parseFloat(SalesCategory[SalesCategory.indexOf(sources[i][9])+1]))/2,
    			category: parseFloat(sources[i][9]) + "-" + parseFloat(SalesCategory[SalesCategory.indexOf(sources[i][9])+1])
    		},
    		employees: {
    			min: parseFloat(sources[i][10]),
    			max: parseFloat(EmployeeCategory[EmployeeCategory.indexOf(sources[i][10])+1]),
    			average: (parseFloat(sources[i][10])+parseFloat(EmployeeCategory[EmployeeCategory.indexOf(sources[i][10])+1]))/2,
    			category: parseFloat(sources[i][10]) + "-" + parseFloat(EmployeeCategory[EmployeeCategory.indexOf(sources[i][10])+1])
    		},
        coords: [49.282767,-123.120839]
    	}
	}
	return sources;
}

