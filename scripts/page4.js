var map = L.map('mapid', {'worldCopyJump': true});
	 		map.setView([45.5038265, -73.6654696], 10);
	 		L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	    	{maxZoom:100, minZoom:1}).addTo(map);
var markers = L.layerGroup().addTo(map);
var salesMIN, salesMAX, employeeMIN, employeeMAX, selectedSectors;
function initMap() {

    var input = document.getElementById('pac-input');

    var autocomplete = new google.maps.places.Autocomplete(input, {placeIdOnly: true});
    var geocoder = new google.maps.Geocoder;

    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();

      if (!place.place_id) {
        return;
      }
      geocoder.geocode({'placeId': place.place_id}, function(results, status) {

        if (status !== 'OK') {
          window.alert('Geocoder failed due to: ' + status);
          return;
        }
        var lon = (results[0].geometry.viewport.b.b + results[0].geometry.viewport.b.f)/2;
        var lat = (results[0].geometry.viewport.f.b + results[0].geometry.viewport.f.f)/2;
        var zoom = Math.log( Math.max( Math.abs(results[0].geometry.viewport.b.b - results[0].geometry.viewport.b.f)/1.5, Math.abs(results[0].geometry.viewport.f.b - results[0].geometry.viewport.f.f) ) );
        zoom = 3 + (zoom-4.11)*7/-5;

        map.setView([lat,lon],zoom);

      });
    });
}

d3.queue()
  .defer(d3.text, "./data/NEWallCoords.csv")

  .defer(d3.text, "./data/SIC-depth1.csv")
  .defer(d3.text, "./data/SIC-depth2.csv")
  .defer(d3.text, "./data/SIC-depth3.csv")
  .defer(d3.text, "./data/SIC-depth4.csv")
  .awaitAll(function(error,text){

	// À mettre dans le main lorsqu'on merge indexMap et index:
	var originmtl = createSourcesMTL(text[0]);
	var mtl = $.extend(true, [], originmtl);
	var currentPage = 0;
	var currentData = mtl.slice(currentPage*20,(currentPage+1)*20);


	d3.select("#button").on("click",function() { 
		mtl = applyFilters(originmtl);
		ShowApplyFilters(0);

	});
	
	
	
	updateMarkers(currentData, markers); //on doit le mettre dans le onclick du filter button.
	displayList(currentData);				//ca aussi
	salesMIN = d3.min(mtl,function(d){return d.sales.average});
	salesMAX = d3.max(mtl,function(d){return d.sales.average});
	employeeMIN = d3.min(mtl,function(d){return d.employees.average});
	employeeMAX = d3.max(mtl,function(d){return d.employees.average});
	selectedSectors = "all";
	setupSlider("#slider1",salesMIN,salesMAX);
	setupSlider("#slider2",1,employeeMAX);



	var SIC1 = createSICSources( text[1] );
	var SIC2 = createSICSources( text[2] );
	var SIC3 = createSICSources( text[3] );
	var SIC4 = createSICSources( text[4] );

	//displayTree(SIC1, SIC2, SIC3, SIC4)	
	
	// Set the propagation of the tree
    $(".acidjs-css3-treeview").delegate("label input:checkbox", "change", function() {
        var
            checkbox = $(this),
            nestedList = checkbox.parent().next().next(),
            selectNestedListCheckbox = nestedList.find("label:not([for]) input:checkbox");
	    if(checkbox.is(":checked")) {
            return selectNestedListCheckbox.prop("checked", true);
        }
        selectNestedListCheckbox.prop("checked", false);
    });
    
    $("#treeview-container").click( function() {
    	$(".acidjs-css3-treeview").toggle();
    });


    $("#leftarrow").click(function() {
    	currentPage = changePage(currentPage - 1, mtl);
    	currentData = mtl.slice(currentPage*20,(currentPage+1)*20);
		updateMarkers(currentData, markers);
		displayList(currentData);
		$("#nb-page").text( currentPage+1 );
    });
    $("#rightarrow").click(function() {
    	currentPage = changePage(currentPage + 1, mtl);
    	currentData = mtl.slice(currentPage*20,(currentPage+1)*20);
		updateMarkers(currentData, markers);
		displayList(currentData);
		$("#nb-page").text( currentPage+1 );
    });

    applyFilters(originmtl);

});


function changePage(Page, mtl) {
	if (Page < 0) {
		Page = 0
	} else if (Page >= parseInt(mtl.length/20) ) {
		Page = parseInt(mtl.length/20)-1
	}
	return Page;

}

function displayTree(SIC1, SIC2, SIC3, SIC4) {
	$(".acidjs-css3-treeview").empty()

	var s = "<ul>";
	for(var i1 = 0; i1 < SIC1.length; i1++) {
		s += '<li><input type="checkbox" id="node-';
		s += 	String(i1)+'" unchecked /><label><input type="checkbox" /><span></span></label><label for="node-'+
				String(i1)+'">'+SIC1[i1][0]+':'+SIC1[i1][1]+'</label>';
		
		s += "<ul>";
		for(var i2 = 0; i2 < SIC2.length; i2++) {
			
			if ( SIC2[i2][0].slice(0,1) == SIC1[i1][0] ) {
				s += '<li><input type="checkbox" id="node-';
				s += 	String(i1)+"-"+String(i2)+'" unchecked /><label><input type="checkbox" /><span></span></label><label for="node-'+
						String(i1)+"-"+String(i2)+'">'+SIC2[i2][0]+':'+SIC2[i2][1]+'</label>';

				s += "<ul>";
				for(var i3 = 0; i3 < SIC3.length; i3++) {
					
					if ( SIC3[i3][0].slice(0,3) == SIC2[i2][0] ) {
						s += '<li><input type="checkbox" id="node-';
						s += 	String(i1)+"-"+String(i2)+"-"+String(i3)+'" unchecked /><label><input type="checkbox" /><span></span></label><label for="node-'+
								String(i1)+"-"+String(i2)+"-"+String(i3)+
								'">'+SIC3[i3][0]+':'+SIC3[i3][1]+'</label>';

						s += "<ul>";
						for(var i4 = 0; i4 < SIC4.length; i4++) {
							
							if ( SIC4[i4][0].slice(0,4) == SIC3[i3][0] ) {
								s += '<li><input type="checkbox" id="node-';
								s += 	String(i1)+"-"+String(i2)+"-"+String(i3)+"-"+String(i4)+'" unchecked /><label><input type="checkbox" /><span></span></label><label for="node-'+
										String(i1)+"-"+String(i2)+"-"+String(i3)+"-"+String(i4)+
										'">'+SIC4[i4][0]+':'+SIC4[i4][1]+'</label>';
								s += "</li>";
							}
						}
						s += "</ul>";
						s += "</li>";
					}
				}
				s += "</ul>";
				s += "</li>";	
			}
		}
		s += "</ul>";
		s += "</li>";
	}
	s += "</ul>";

	$(".acidjs-css3-treeview").append(s);
}

function createSICSources(text) {
	var arr = text.split("\n");
	for(var i = 0; i < arr.length; i++) {
		arr[i] = arr[i].split(";");
	}
	
	return arr;
}

function displayList(data) {
	$("#resultats").empty();
	var s = "";
	for(var i = 0; i < data.length; i++) {
		s += "<li>";
		s += "<h3>"+data[i].name+"</h3>";
		s += "<p>"+data[i].address+", "+data[i].postalCode+", "+data[i].city+"</p>";
		s += "<p>"+data[i].sicDescriptionfr+"</p>";
		s += "<p>"+data[i].sales.average+" M$ pour ";
		s += data[i].employees.average+" employés</p>";
		s += "<p><a href='https://www.google.ca/search?q="+data[i].name+" MONTREAL'>Site web</a></p>";
		s += "</li>";
	}
	s += "";
	$("#resultats").append(s);
}

function info(d) {
	return " <b style='font-size: 16px; text-align: center;'>"+ d.name +"</b><br>"+d.address+ "<br>" +
	    	"Secteur: " + d.sicDescriptionfr + "<br>" +
	    	"Employes: "+ String(d.employees.average) + "<br>"+
	    	"Revenus: "+ String(d.sales.average) + " millions $"+"<br>"
	    	+ "<a href='https://www.google.ca/search?q="+d.name+" MONTREAL'>Site web</a>";

}
function updateMarkers(currentData, markers){
	markers.clearLayers();
	for(var i=0; i<currentData.length; i++) {
	    L.marker([currentData[i].coords[0],currentData[i].coords[1]])
	    	.bindPopup(info(currentData[i]))
	    	.addTo(markers);
	}
}
//Fonction à appler lorsque le bouton apply est cliqué
function applyFilters(allData){
	//Premier filtre: sales
	
	var data_f1 = allData.filter(function(d) {return (d.sales.average >= salesMIN && d.sales.average <= salesMAX);});
	var data_f2 = data_f1.filter(function(d) {return (d.employees.average >= employeeMIN && d.employees.average <= employeeMAX);});
	var data_f3;
	if(selectedSectors == "all"){
		data_f3 = data_f2;
	} 
	else {
		data_f3 = data_f2.filter(function(d) { 
		var isIncluded = false;
		for(var i=0; i<selectedSectors || isIncluded==false; i++) {
			if(d.sicCode.slice(0,selectedSectors[i].length) == selectedSectors[i] )
				isIncluded = true;
		}
		return isIncluded;
		}); 
	}
	
	updateMarkers(data_f3.slice(0,20), markers);
	displayList(data_f3.slice(0,20));
	$("strong#nb").text(data_f3.length);
	$("#nb-page-tot").text( parseInt(0.99 + data_f3.length / 20) );
	return data_f3;
}

function setupSlider(divId, v1, v2, filter,currentData, allData){

	var sliderVals=[v1, v2],
	    width = ($("#mapid").height()/2),
	    svg = d3.select(divId).append("svg")
	      .attr('width', width+10)
	      .attr('height', 50);

	if (divId == "#slider1") {
		$("#slider1").append('<p>(De <strong id="min"></strong> à <strong id="max"></strong> M$)</p>')
	} else {
		$("#slider2").append('<p>(De <strong id="min"></strong> à <strong id="max"></strong> employés)</p>');
	}

	var minTextFeild = d3.select(divId).select("#min").text(String(v1));
	var maxTextFeild = d3.select(divId).select("#max").text(String(v2));


	var x = d3.scale.log()
		.base(10)
	    .domain([v1, v2])    
	    .range([0, width])
	    .clamp(true);
	var xMin=x(v1),        
	    xMax=x(v2)

	var slider = svg.append("g")
	    .attr("class", "slider")
	    .attr("transform", "translate(0,20)");

	slider.append("line")
	    .attr("class", "track")
	    .attr("x1", 5+x.range()[0])
	    .attr("x2", 5+x.range()[1])

	var selRange = slider.append("line")
	    .attr("class", "sel-range")
	    .attr("x1", 5+x(sliderVals[0]))
	    .attr("x2", 5+x(sliderVals[1]))

	slider.insert("g", ".track-overlay")
	    .attr("class", "ticks")
	    .attr("transform", "translate(10,24)")
	  .selectAll("text")
	  .data(x.ticks(2))
	  .enter().append("text")
	    .attr("x",x)
	    .attr("text-anchor", "middle")
	    .text(function(d,i) {
	    	if(i == 0)
	    		return v1;
	    	if(d == v2)
	    		return v2;
	    });

	var dispatch = d3.dispatch("sliderChange");
	
	var handle = slider.selectAll("rect")
	  .data([0, 1])
	  .enter()
	  .append("rect", ".track-overlay")
	    .attr("class", "handle")
	    .attr("y", -10)
	    .attr("x", function(d) { return x(sliderVals[d]); })
	    .attr("rx", 3)
	    .attr("height", 20)
	    .attr("width", 10)
	    .call(d3.behavior.drag()
	          .on("dragstart", startDrag)
	          .on("drag", drag)
	          .on("dragend", endDrag)
	    );

	function startDrag(d){
	  d3.event.sourceEvent.stopPropagation();
  	  d3.select(this).classed("dragging", true);
	}

	function drag(d){
	  var x1 = d3.event.x;
	  if(x1 > xMax){
	    x1 = xMax
	  }else if(x1 < xMin){
	    x1 = xMin
	  }
	  d3.select(this).attr("x", x1);

	  var x2 = x(sliderVals[d==0?1:0])

	  var v1 = Math.min(x1, x2),
	      v2 = Math.max(x1, x2);

	  var v = Math.round(x.invert(d3.event.x));
	  var elem = d3.select(this);
	  var n = String(v).length;
	  v = Math.round(10*v/(10**n))*10**(n-1);
	  //if (v < v1) { v = v1; }
	  sliderVals[d] = v;
	  var v1 = Math.min(sliderVals[0], sliderVals[1]),
	      v2 = Math.max(sliderVals[0], sliderVals[1]);
	  elem.attr("x", x(v));
	  minTextFeild.text(String(v1));
	  maxTextFeild.text(String(v2));

	  selRange
	      .attr("x1", 10+x(v1))
	      .attr("x2", 10+x(v2))
	}

	function endDrag(d){
	 //Juste à la fin du drag:
	  var v1=Math.min(sliderVals[0], sliderVals[1]),
	      v2=Math.max(sliderVals[0], sliderVals[1]);
	  if (divId == "#slider1"){
	  	salesMIN = v1;
	  	salesMAX = v2;
	  }
	  else {
	  	employeesMIN = v1;
	  	employeeMAX = v2;
	  }
	  ShowApplyFilters(1)
	}

}

function ShowApplyFilters(b) {
	if (b == 1) {
		$("#greymap").show();
	} else {
		$("#greymap").hide("slow");
	}
}

