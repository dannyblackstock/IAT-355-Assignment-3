function showTooltip(d){
  // get mouse position to show tooltip
  var bodyNode = d3.select('body').node();
  var absoluteMousePos = d3.mouse(bodyNode);

  var tooltip = d3.select("#tooltip");

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
  d3.select("#tooltip").classed("tooltip-hidden", true);
}