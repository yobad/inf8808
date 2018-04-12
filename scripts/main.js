"use strict";

/**
 * Fichier permettant de dessiner les graphiques à bandes pour la première visu.
 */
var nbTotalComp = 822176;

/***** Chargement des données *****/
  d3.queue()
  .defer(d3.text, "./data/NEWallCoords.csv")
  .defer(d3.text, "./data/page2.csv")
  .defer(d3.text, "./data/page3.csv")
  .awaitAll(function(error,results){
    if (error) {
      throw error;
    }   

  
    /***** PAGE 4 *****/
    var mtl = results[0];
    var MTL = createSourcesMTL(mtl);

    /***** PAGE 2 *****/
    var P2source = results[1];
    P2source = createP2Source(P2source);
    var P2sourceClean = P2source[0];
    var P2sourceJobs = P2source[1];
    total1 = d3.sum(P2sourceJobs, function(d){return d.count;})
    var P2sourceSales = P2source[2];
    total2 = d3.sum(P2sourceSales, function(d){return d.count;})
    
    setDomain(x1,y1, P2sourceJobs);
    createBarChart(barChartGroup1, P2sourceJobs, x1, y1, tip11, barChartHeight, barChartWidth,
      "Où travaillent les Canadiens?"); 
    createAxes(barChartGroup1, xAxis1, yAxis1,
      "Nombre d'employés de l'entreprise","Emplois totaux créés (en millions)",
      barChartHeight, barChartWidth);
    barChartSvg.call(tip11);

    
    setDomain(x2,y2, P2sourceSales);
    createBarChart(barChartGroup2, P2sourceSales, x2, y2, tip12, barChartHeight, barChartWidth,
      "Où sont générés les revenus du pays?");
    createAxes(barChartGroup2, xAxis2, yAxis2,
      "Nombre d'employés de l'entreprise","Revenus totaux générés (en milliards $)",
      barChartHeight, barChartWidth);
    barChartSvg.call(tip12);
    
    /***** PAGE 3*****/
    var P3source = results[2];
    P3source = createP3Source(P3source);
    totaux = calculateTotals(P3source);
    var variables = ["Nombre total de compagnies","Petites entreprises (1-99)","Moyennes entreprises (100-499)","Grandes entreprises (500+)", "Nombre total d'employés", "Revenus générés","Revenus par employé"];
    var varaibaleAafficher_axe1 = 0;
    var varaibaleAafficher_axe2 = 0;
    setDoubleDomain(xBig,yBig1,yBig2, P3source, varaibaleAafficher_axe1, varaibaleAafficher_axe2);
    createTripleAxes(BigbarChartGroup, xAxisBig, yAxisBig1, yAxisBig2, " "," "," ",BigbarChartHeight, BigbarChartWidth);
    createBigBarChart(BigbarChartGroup, P3source, xBig, yBig1,yBig2, tip2, BigbarChartHeight, BigbarChartWidth, 
                      varaibaleAafficher_axe1, varaibaleAafficher_axe2);
    BigbarChartSvg.call(tip2);
    
    /*****COMBO BOX ****/
    d3.select("#comboBox1")
    .on("change", function() {
      varaibaleAafficher_axe1 = d3.select(this).property("value");
      setDoubleDomain(xBig,yBig1,yBig2, P3source,varaibaleAafficher_axe1, varaibaleAafficher_axe1);
      transitionY1(BigbarChartGroup, P3source,yBig1,yAxisBig1,BigbarChartHeight, varaibaleAafficher_axe1);})
    .selectAll("option")
    .data(variables)
    .enter()
    .append("option")
    .attr("value", function(d,i) {return i;})
    .text(function(d) { return d;})
   
    d3.select("#comboBox2")
    .on("change", function() {
      varaibaleAafficher_axe2 = d3.select(this).property("value");
      setDoubleDomain(xBig,yBig1,yBig2, P3source,varaibaleAafficher_axe1,varaibaleAafficher_axe2);
      transitionY2(BigbarChartGroup, P3source,yBig2,yAxisBig2,BigbarChartHeight,varaibaleAafficher_axe2);
    })
    .selectAll("option")
    .data(variables)
    .enter()
    .append("option")
    .attr("value", function(d,i) { return i;}).text(function(d) { return d;})
   
});

function getFormattedNumber(number) {
  if (number % 1 !== 0) {
    number = number.toFixed(2).replace('.', ',')
  }
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};

function getFormattedPercent(percent) {
  return d3.format(".1%")(percent).replace(".", ",");
};