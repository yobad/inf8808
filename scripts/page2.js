//Ce qu'il restent à faire:
//1- Tool Tip
//2- Axes x rotation du text:

//SETUP VISUALISATION PAGE 1: 
var total1,total2;
/***** Configuration *****/
  var barChartsMargins = {
    top: 40,
    right: 40,
    bottom: 50,
    left: 40
  };
  var p2width = $("#page2").width();
  var p2height = $("#page2").height()-120;
  var barChartWidth =  p2width/2 - barChartsMargins.left - barChartsMargins.right;
  var barChartHeight = p2height- barChartsMargins.top - barChartsMargins.bottom;

/***** Échelles et Axes *****/

  // Premier bar chart
  var x1 = d3.scale.ordinal().rangeRoundBands([0, barChartWidth], 0.05);
  var y1 = d3.scale.linear().range([barChartHeight, 0]);
  
  var xAxis1 = d3.svg.axis().scale(x1).orient("bottom");
  var yAxis1 = d3.svg.axis().scale(y1).orient("left")

  //Deuxième bar chart
  var x2 = d3.scale.ordinal().rangeRoundBands([0, barChartWidth], 0.05);
  var y2 = d3.scale.linear().range([barChartHeight, 0]);

  var xAxis2 = d3.svg.axis().scale(x2).orient("bottom");
  var yAxis2 = d3.svg.axis().scale(y2).orient("left");


/***** Création des éléments du diagramme à barres *****/
  //SVG pour tout le monde
  var barChartSvg = d3.select("#simple-bar-chart-svg")
  .attr("width", p2width)
  .attr("height", p2height); 
  // Premier bar chart
  var barChartGroup1 = barChartSvg.append("g")
  .attr("transform", "translate(" + barChartsMargins.left + "," + barChartsMargins.top + ")");
  //Deuxième bar chart
  var barChartGroup2 = barChartSvg.append("g")
  .attr("transform", "translate(" + (barChartsMargins.left + barChartWidth + barChartsMargins.left
    + barChartsMargins.right) + ","  + barChartsMargins.top + ")");
  

/***** Création des tool tip *****/
var tip11 = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);
  tip11.html(function(d) {
    return getToolTipText(this, d, 1);
  });

var tip12 = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0]);
  tip12.html(function(d) {
    return getToolTipText(this, d, 2);
  });

function setDomain(x,y, sources) {
  x.domain(sources.map(function(d) { return d.category;}));
  y.domain([0, d3.max(sources,function(d) { return d.count;})]);
}

function createAxes(g, xAxis, yAxis, xtitle, ytitle, height, width) {
  
  var groupeAxeY = g.append("g")
                    .attr("class", "axis y")
                    .attr("transform","translate(10,0)")
                    .call(yAxis)
                    .append("text")
                    .text(ytitle)
                    .style("text-anchor","right")
                    .attr("transform","translate(-35,"+(height)+") rotate(-90)");

  var groupeAxeX = g.append("g")
                    .attr("class", "axis x")
                    .attr("transform","translate(10,"+height+")")
                    .call(xAxis)
                    .append("text")
                    .text(xtitle)
                    .attr("id","xlabel")
                    .style("text-anchor", "right")
                    .attr("transform", "translate("+(width-195)+",-5)");
                    
  $("g.axis.x > g.tick > text")
    .attr("transform", "translate(0,0) rotate(30)")
    .attr("style","text-anchor: left");
     
}

function createBarChart(g, sources, x, y, tip, height, width, title) {
  g.append("text").text(title)
  .style("text-anchor","middle")
  .attr("class","barchart-title")
  .attr("transform", "translate("+width/2+",-10)");

  g.selectAll("rect")
  .data(sources)
  .enter()
  .append("rect")
  .attr("class", "bar")
  .attr("x", function(d) { return 9 + x(d.category); } )
  .attr("y", function(d) { return y(d.count) - 1; } )
  .attr("width", x.rangeBand() )
  .attr("height", function(d) {return height-y(d.count);} )
  
  .on('mouseover',function(d) {
    d3.select(this).classed("hovered-bar",true);
    tip.show.call(this, d);
  })
  .on('mouseout',function(d) {
    d3.select(this).classed("hovered-bar",false);
    tip.hide.call(this, d);
  });

}
function getToolTipText(el, data, tipNb) {
  if (tipNb == 1){
    return "<span class='tipLabel'>Entreprise de:</span> <span class='tipValue'>"+data.category+
    "</span> employés<br><span class='tipLabel'>Emplois totaux:</span> <span class='tipValue'>"+
    getFormattedNumber(parseInt(data.count*1000000))+"</span> emplois<br>"+
    "<span class='tipLabel'>À l'échelle du Canada: </span> <span class='tipValue'>"+
     getFormattedPercent(data.count/total1) +"</span>";
  } else {
    return "<span class='tipLabel'>Entreprise de:</span> <span class='tipValue'>"+data.category+
    "</span> employés<br><span class='tipLabel'>Revenus totaux:</span> <span class='tipValue'>"+
    getFormattedNumber(parseInt(data.count*1000))+"</span> $<br>"+
    "<span class='tipLabel'>À l'échelle du Canada: </span> <span class='tipValue'>"+
     getFormattedPercent(data.count/total2)+"</span>";
  }
}

function getFormattedNumber(number) {
  if (number % 1 !== 0) {
    number = number.toFixed(2).replace('.', ',')
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};