//SETUP VISUALISATION PAGE 2: 

 /***** Configuration *****/
var p3width = $("#page3").width()-200;
var p3height = $("#page3").height()-40-100;
var sideMargins = 130; 
var BigbarChartWidth = p3width - sideMargins;
var BigbarChartHeight = p3height - barChartsMargins.top - barChartsMargins.bottom;

 /***** Échelles et Axes *****/
 /**axe x ***/
var xBig = d3.scale.ordinal().rangeRoundBands([0, BigbarChartWidth], 0.05);
var xAxisBig = d3.svg.axis().scale(xBig).orient("bottom");
 /**axe y1 ***/
var yBig1 = d3.scale.linear().range([BigbarChartHeight, 0]);
var yBig2 = d3.scale.linear().range([BigbarChartHeight, 0]);
 /**axe y2***/
var yAxisBig1 = d3.svg.axis().scale(yBig1).orient("left").innerTickSize(-BigbarChartWidth);
var yAxisBig2 = d3.svg.axis().scale(yBig2).orient("right").innerTickSize(-BigbarChartWidth);


 /***** Création des éléments du diagramme à barres *****/
var BigbarChartSvg = d3.select("#double-bar-chart-svg")
  .attr("width",  p3width)
  .attr("height", p3height); 

var BigbarChartGroup = BigbarChartSvg.append("g")
  .attr("transform", "translate(" + (sideMargins/2) + "," + barChartsMargins.top + ")");
/***** TOOL TIP *****/
var tip2 = d3.tip()
   .attr('class', 'd3-tip')
  .offset([-10, 0]);
 tip2.html(function(d) {
    return getToolTipText2(this, d);
 });
 var totaux;
function getToolTipText2(elem, d) {
  // TODO: Retourner le texte à afficher dans l'infobulle selon le format demandé.
  console.log("2-" + totaux);
  if(elem.className.animVal == "bar1 hovered-bar")
    var Noy = d3.select("#comboBox1").property("value");
  else if(elem.className.animVal == "bar2 hovered-bar")
    var  Noy = d3.select("#comboBox2").property("value");
  var text;
  if(Noy==0)
  
    text = "<span class='tipLabel'>Ville : </span> <span class='tipValue'>"+d.city+
    "</span><br><span class='tipLabel'>Nombre total de compagnies:</span> <span class='tipValue'>"+
    d.y1[Noy]+"</span><br>"+ "<span class='tipLabel'>À l'échelle du Canada: </span> <span class='tipValue'>"+
    getFormattedPercent(parseInt(d.y1[Noy])/totaux[Noy])+"</span>";
  if(Noy==1)
    text = "<span class='tipLabel'>Ville : </span> <span class='tipValue'>"+d.city+
    "</span><br><span class='tipLabel'>Nombre de petites entreprises:</span> <span class='tipValue'>"+
    d.y1[Noy]+"</span><br>"+ "<span class='tipLabel'>À l'échelle du Canada: </span> <span class='tipValue'>"+
    getFormattedPercent(parseInt(d.y1[Noy])/totaux[Noy])+"</span>";
  if(Noy==2)
    text = "<span class='tipLabel'>Ville : </span> <span class='tipValue'>"+d.city+
    "</span><br><span class='tipLabel'>Nombre de moyennes entreprises:</span> <span class='tipValue'>"+
    d.y1[Noy]+"</span><br>"+ "<span class='tipLabel'>À l'échelle du Canada: </span> <span class='tipValue'>"+
    getFormattedPercent(parseInt(d.y1[Noy])/totaux[Noy])+"</span>";
  if(Noy==3)
    text = "<span class='tipLabel'>Ville : </span> <span class='tipValue'>"+d.city+
    "</span><br><span class='tipLabel'>Nombre de grandes entreprises:</span> <span class='tipValue'>"+
    d.y1[Noy]+"</span><br>"+ "<span class='tipLabel'>À l'échelle du Canada: </span> <span class='tipValue'>"+
    getFormattedPercent(parseInt(d.y1[Noy])/totaux[Noy])+"</span>";
  if(Noy==4)
    text = "<span class='tipLabel'>Ville : </span> <span class='tipValue'>"+d.city+
    "</span><br><span class='tipLabel'>Nombre total d'employés:</span> <span class='tipValue'>"+
    d.y1[Noy]+"</span><br>"+ "<span class='tipLabel'>À l'échelle du Canada: </span> <span class='tipValue'>"+
    getFormattedPercent(parseInt(d.y1[Noy])/totaux[Noy])+"</span>";
  if(Noy==5)
    text = "<span class='tipLabel'>Ville : </span> <span class='tipValue'>"+d.city+
    "</span><br><span class='tipLabel'>Revenus totaux générés:</span> <span class='tipValue'>"+
    getFormattedNumber(d.y1[Noy])+"</span> en G$ CAN<br>"+
    "<span class='tipLabel'>À l'échelle du Canada: </span> <span class='tipValue'>"+
    getFormattedPercent(parseInt(d.y1[Noy])/totaux[Noy])+"</span>";
  if(Noy==6)
    text = "<span class='tipLabel'>Ville : </span> <span class='tipValue'>"+d.city+
    "</span><br><span class='tipLabel'>Revenu par employés moyen:</span> <span class='tipValue'>"+
    getFormattedNumber(d.y1[Noy])+"</span> $/employé<br>";

  return text;
}
function setDoubleDomain(x,y1,y2, sources,Noy1, Noy2) {
  
  x.domain(sources.map(function(d) { return d.city;}));
  var maxY1 = d3.max(sources, function(d) { return d.y1[Noy1];});
  var maxY2 = d3.max(sources, function(d) { return d.y2[Noy2];});
  y1.domain([0, maxY1]);
  y2.domain([0, maxY2]);

}

function createTripleAxes(g, xAxis, yAxis1,yAxis2, xtitle, ytitle1, ytitle2, height, width) {
  // TODO: Dessiner les axes X et Y du graphique. Assurez-vous d'indiquer un titre pour l'axe Y.
  var groupeAxeY = g.append("g")
                    .attr("class", "axis y")
                    .attr("id", "axeY1")
                    .attr("transform","translate(0,0)")
                    .call(yAxis1)
                    .append("text")
                    .text(ytitle1)
                    .style("text-anchor","middle")
                    .attr("transform","translate(-50,"+height/2+") rotate(-90)");

 var groupeAxeY2 = g.append("g")
                    .attr("class", "axis y")
                    .attr("id", "axeY2")
                    .attr("transform","translate("+(width)+",0)")
                    .call(yAxis2)
                    .append("text")
                    .text(ytitle2)
                    .style("text-anchor","middle")
                    .attr("transform","translate(-50,"+height/2+") rotate(-90)");

  var groupeAxeX = g.append("g")
                    .attr("class", "axis x")
                    .attr("transform","translate(0,"+height+")")
                    .call(xAxis)
                    .append("text")
                    .text(xtitle)
                    .style("text-anchor", "middle")
                    .attr("transform","translate("+width/2+",50)")
                    .selectAll('tick.text')                      
                    .style("text-anchor","start")
                    .attr("transform", "translate(10,0) rotate(30)");
     
}
function calculateTotals(sources){

  var total;
  var totaux =[]; 
  for(var i=0; i<sources[0].y1.length;i++){
    total = d3.sum(sources,function(d){return d.y1[i];});
    totaux.push(total);
  }
  return totaux;
}

function createBigBarChart(g, sources, x, y1,y2, tip, height, width, Noy1,Noy2) {
  // TODO: Dessiner les cercles à bandes en utilisant les échelles spécifiées.
  //       Assurez-vous d'afficher l'infobulle spécifiée lorsqu'une barre est survolée.\


//Groups de bars
var doubleBarGroups = 
g.selectAll(".doubleBar-group")
  .data(sources)
  .enter()
  .append("g")
  .attr("class", "doubleBar-group") 
  .attr("transform", function(d) {
    return "translate ("+(9+ x(d.city))+ ",-1)";
  });
// Première bars
var bars = doubleBarGroups.append("rect")
                          .attr("class", "bar1")
                          .attr("y",function(d,i){return y1(d.y1[Noy1]);})
                          .attr("width",x.rangeBand()/2.5)
                          .attr("height",function(d,i) {return height-y1(d.y1[Noy1]);})
                          .attr("fill","#178fd7")
                          .attr("transform","translate(0,0)")
                          .on('mouseover',function(d) {
                            d3.select(this).classed("hovered-bar",true);
                            tip.show.call(this,d);
                          })
                          .on('mouseout',function(d) {
                            d3.select(this).classed("hovered-bar",false);
                            tip.hide.call(this,d);
                          }); 
var bars2 = doubleBarGroups.append("rect")
                          .attr("class", "bar2")
                          .attr("y",function(d,i){return y2(d.y2[Noy2]);})
                          .attr("width",x.rangeBand()/2.5)
                          .attr("height",function(d,i) {return height-y2(d.y2[Noy2]);})
                          .attr("fill","white")
                          .attr("transform","translate("+(x.rangeBand()/2.5)+",0)")
                          .on('mouseover',function(d) {
                            d3.select(this).classed("hovered-bar",true);
                            tip.show.call(this,d);
                          })
                          .on('mouseout',function(d) {
                            d3.select(this).classed("hovered-bar",false);
                            tip.hide.call(this,d);
                          }); 
}

function transitionY1(g, sources, y1, yAxis1, height, Noy1) {
  /* TODO:
   - Réaliser une transition pour mettre à jour l'axe des Y et la hauteur des barres à partir des nouvelles données.
   - La transition doit se faire en 1 seconde.
   */

   g.select("#axeY1").transition().duration(1000).call(yAxis1);
   g.selectAll(".doubleBar-group")
    .select(".bar1")
    .data(sources)
    .transition()
      .duration(1000)
        .attr("y",function(d){return y1(d.y1[Noy1]);})
        .attr("height",function(d) {return height-y1(d.y1[Noy1]);})
}
function transitionY2(g, sources, y2, yAxis2, height, Noy2) {
  /* TODO:
   - Réaliser une transition pour mettre à jour l'axe des Y et la hauteur des barres à partir des nouvelles données.
   - La transition doit se faire en 1 seconde.
   */
   
   g.select("#axeY2").transition().duration(1000).call(yAxis2);
   g.selectAll(".doubleBar-group")
    .select(".bar2")
    .data(sources)
    .transition()
      .duration(1000)
        .attr("y",function(d){return y2(d.y2[Noy2]);})
        .attr("height",function(d) {return height-y2(d.y2[Noy2]);})
}
