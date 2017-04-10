var w=1100,
h=550;
var margin={
  top:40,
  right:40,
  bottom:40,
  left:70
};
var width=w-margin.top-margin.bottom,
height=h-margin.right-margin.left;

var svg=d3.select(".chart")
.append("svg")
.attr({
  width:w,
  height:h,
  id:"chart"
});

var chart=svg.append("g")
.attr({transform:"translate("+margin.left+","+margin.top+")"});


var div=d3.select("body")
.append("div")
.classed("tooltip",true)
.style("opacity",0);
d3.json("https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json",function(error,gdp){
  if(error) throw error;
  (gdp.data).forEach(function(d){
    var dateParse=d3.time.format("%Y-%m-%d").parse;
    d[0]=dateParse(d[0]);
  })

  //yScale
  var yScale=d3.scale.linear()
  .domain([0,d3.max(gdp.data,function(d){return d[1];})])
  .range([height,0])
  .nice();

  //xScale
  var xScale=d3.time.scale()
  .domain([(gdp.data[0][0]),(gdp.data[(gdp.data).length-1][0])])
  .rangeRound([0,width]);

  //yAxis
  var yAxis=d3.svg.axis()
  .scale(yScale)
  .orient("left");

  //xAxis
  var xAxis=d3.svg.axis()
  .scale(xScale)
  .orient("bottom")
  .tickFormat(d3.time.format('%Y'));

  chart.append("g")
  .classed("y axis",true)
  .attr({"transform":"translate(0,0)"})
  .call(yAxis)
  .append("text")
  .attr({
    x:-105,
    y:20,
    "text-anchor":"end",
    "font-size":"15px",
    transform:"translate(0,0) rotate(-90)"
  })
  .text("Gross Domestic Product,USA");

  chart.append("g")
  .classed("x axis",true)
  .attr({"transform":"translate(0,"+height+")"})
  .call(xAxis);
  chart.selectAll(".bar")
  .data(gdp.data)
  .enter()
  .append("rect")
  .classed("bar",true);
  var timeFormat=d3.time.format("%Y-%B");
  chart.selectAll(".bar")
  .attr({
    x:function(d){
      return xScale(d[0]);
    },
    y:function(d){
      return yScale(d[1]);
    },
    width:w/(gdp.data).length,
    height:function(d){
      return height-yScale(d[1]);
    },
    fill:"steelblue"
  })
  .on("mouseover",function(d){
    div.transition()
    .duration(50)
    .style("opacity","0.6");
    div.html("<span><b>"+"$"+d[1]+" Billion"+"</b></span><br>"+
     "<span> "+timeFormat(d[0])+" </span>")
    .style("left",(d3.event.pageX)+ "px")
    .style("top",(d3.event.pageY-30)+ "px");
  })
  .on("mouseout", function(d) {
    div.transition()
    .duration(50)
    .style("opacity", 0);
  });

  d3.select(".notes")
  .append("text")

  .text(gdp.description);


});