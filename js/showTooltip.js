function showTooltip(d){
  // get mouse position to show tooltip
  var bodyNode = d3.select('body').node();
  var absoluteMousePos = d3.mouse(bodyNode);

  var tooltip = d3.select("#tooltip");
  var symbols = d3.selectAll("body #scatter-plot path:not(.domain)");
  var lines = d3.selectAll(".foreground path:not(.domain)");

  var underMouse = d;

  symbols.filter(function(d) {
    return (d !== underMouse);
  })
  .style('opacity','0.1');

  lines.filter(function(d) {
    return (d !== underMouse);
  })
  .style('opacity','0');
  // d3.select(d).style('opacity','1.0');

  //Update the tooltip values
  tooltip.select("#species")
    .text(d["Species"]);

  tooltip.select("#sepal-width")
    .text(d["Sepal Width"]);

  tooltip.select("#petal-width")
    .text(d["Petal Width"]);

  tooltip.select("#sepal-length")
    .text(d["Sepal Length"]);

  tooltip.select("#petal-length")
    .text(d["Petal Langth"]);

  //Show and position the tooltip
  tooltip.classed("tooltip-hidden", false)
  .style({
      left: (absoluteMousePos[0] + 20) + 'px',
      top: (absoluteMousePos[1] - 22) + 'px',
  });
}

function hideTooltip() {
  var symbols = d3.selectAll("body #scatter-plot path:not(.domain)");
  var lines = d3.selectAll(".foreground path:not(.domain)");

  d3.select("#tooltip").classed("tooltip-hidden", true);
  symbols.style('opacity','1');
  lines.style('opacity','1');
}