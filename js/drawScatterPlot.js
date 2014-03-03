function drawScatterPlot(data) {

  // keys used for inputs where "Species" key is not allowed
  var numericalKeys = d3.keys(data[0]);
  numericalKeys = numericalKeys.slice(0, 4);

  // the 3 iris types
  var irisTypes = ["setosa", "versicolor", "virginica"];

  var w = 500;
  var h = 500;
  var padding = 30;
  var sizeRange = [10, 50];

  // pad the minimum so data points are never right on the axis
  var minPadding = 0.2;

  // create scales using max values of the inputs and the width/height of the SVG
  var xMax = d3.max(data, function (d) {
    return +d["Sepal Width"];
  });

  var yMax = d3.max(data, function (d) {
    return +d["Sepal Length"];
  });

  var wMax = d3.max(data, function (d) {
    return +d["Petal Width"];
  });

  var xMin = d3.min(data, function (d) {
    return +d["Sepal Width"];
  }) - minPadding;

  var yMin = d3.min(data, function (d) {
    return +d["Sepal Length"];
  }) - minPadding;

  var yScale = d3.scale.linear()
    .domain([yMin, yMax])
    .range([h - padding, padding]);

  var xScale = d3.scale.linear()
    .domain([xMin, xMax])
    .range([padding, w - padding]);

  // scale for circle radii
  var wScale = d3.scale.linear()
    .domain([0, wMax])
    .range(sizeRange);

  // Axex variables
  var xAxis = d3.svg.axis()
    .scale(xScale)
    .orient("bottom")
    .ticks(5); // where the numbers and ticks are drawn

  var yAxis = d3.svg.axis()
    .scale(yScale)
    .orient("left")
    .ticks(5);

  // Create SVG element
  var svg = d3.select("body")
    .append("svg")
    .attr("id", "scatter-plot")
    .attr("width", w)
    .attr("height", h);

  // Create scatter plot brush
  var brush = d3.svg.brush()
    .x(xScale)
    .y(yScale)
    .on("brushstart", brushstart)
    .on("brush", brushCb)
    .on("brushend", brushend);

  svg.call(brush);

  // Add container for controls
  var controlPanel = d3.select("#control-panel");

  // iris type filter checkoxes
  var typeCheckboxes = d3.selectAll(".checkbox")
    .on("click", toggleType);

// ---- Start of code for creating scatter plot dropdowns ----- //

  var xDropdown = controlPanel
    .append("label") // append a label first
    .text("Scatter Plot X Axis: ")
    .append("select")
    .attr("id", "xDropdown")
    .attr("name", "xDropdown")
    .on("change", updateSymbols);

  var xOptions = xDropdown.selectAll("option")
    .data(numericalKeys) // use the keys to populate the dropdown
  .enter()
    .append("option");

  // add the value attribute and the text content of the option element
  xOptions
    .text(function (numericalKeys) {
      return numericalKeys;
    })
    .attr("value", function (numericalKeys) {
      return numericalKeys;
    })
    .attr("selected", function (numericalKeys) {
      if (numericalKeys == "Sepal Width") {
        return "selected";
      }
    });

  var yDropdown = controlPanel
    .append("label") // append a label first
  .text("Y Axis: ")
    .append("select")
    .attr("id", "yDropdown")
    .attr("name", "yDropdown")
    .on("change", updateSymbols);

  var yOptions = yDropdown.selectAll("option")
    .data(numericalKeys) // use the keys to populate the dropdown
  .enter()
    .append("option");


  // add the value attribute and the text content of the option element
  yOptions
    .text(function (numericalKeys) {
      return numericalKeys;
    })
    .attr("value", function (numericalKeys) {
      return numericalKeys;
    });

  // Create drop-down menus for selecting size variable
  var sizeDropdown = controlPanel
    .append("label")
    .text("Size: ")
    .append("select")
    .attr("id", "sizeDropdown")
    .attr("name", "sizeDropdown")
    .on("change", updateSymbols);

  var sizeOptions = sizeDropdown.selectAll("option")
    .data(numericalKeys) // use the keys to populate the dropdown
  .enter()
    .append("option");

  // add the value attribute and the text content of the option element
  sizeOptions
    .text(function (numericalKeys) {
      return numericalKeys;
    })
    .attr("value", function (numericalKeys) {
      return numericalKeys;
    })
    .attr("selected", function (numericalKeys) {
      if (numericalKeys == "Petal Width") {
        return "selected";
      }
    });

// ----- End of code for creating scatter plot dropdowns. ----- //

  createSymbols();
  createAxes();

  function createAxes() {

    // draw the axes
    svg.append("g") // append an SVG group
    .attr("class", "axis") //Assign "axis" class
    .attr("id", "xAxis")
      .attr("transform", "translate(0," + (h - padding) + ")") // move to bottom
    .call(xAxis);

    svg.append("g")
      .attr("class", "axis")
      .attr("id", "yAxis")
      .attr("transform", "translate(" + padding + ",0)")
      .call(yAxis);
  }

  function createSymbols() {
    // Create symbols for the dataset

    var symbols = svg.selectAll("symbol")
      .data(data)
      .enter()
      .append("path")
      .attr("name", function (d) {
        return d["Species"];
      })
      .attr("class", function (d) {
        return d["Species"];
      })
      .attr("transform", function (d) {
        return "translate(" + xScale(d["Sepal Width"]) + "," + yScale(d["Sepal Length"]) + "), scale(" + wScale(d["Petal Width"]) / 40 + ")";
      })
      .attr("fill", function (d) {
        // change colors based on fill
        if (d["Species"] == irisTypes[0]) {
          return "#ff0000";
        } else if (d["Species"] == irisTypes[1]) {
          return "#00cc00";
        } else if (d["Species"] == irisTypes[2]) {
          return "#0000ff";
        }
      })
      .on("mouseover", function (d) {
        showTooltip(d);
      })
      .on("mouseout", function () {
        hideTooltip();
      })
      .attr("d", d3.svg.symbol()
        .type(function (d) {
          // change colors based on fill
          if (d["Species"] == irisTypes[0]) {
            return "cross";
          } else if (d["Species"] == irisTypes[1]) {
            return "diamond";
          } else if (d["Species"] == irisTypes[2]) {
            return "circle";
          }
        })
    );
  }

  // function to update symbols when dropdowns are used
  function updateSymbols() {

    var xDropdownKey = document.getElementById("xDropdown").options[document.getElementById("xDropdown").selectedIndex].value;
    var yDropdownKey = document.getElementById("yDropdown").options[document.getElementById("yDropdown").selectedIndex].value;
    var sizeDropdownKey = document.getElementById("sizeDropdown").options[document.getElementById("sizeDropdown").selectedIndex].value;

    var max;
    var min;

    var paths = svg.selectAll("path")
      .transition()
      .duration(200)
      .ease("quad");

    wMax = d3.max(data, function (d) {
      return +d[sizeDropdownKey];
    });
    wScale
      .domain([0, wMax])
      .range(sizeRange);

    // if the x dropdown changed
    if (this.id == "xDropdown") {
      max = d3.max(data, function (d) {
        return +d[xDropdownKey];
      });
      min = d3.min(data, function (d) {
        return +d[xDropdownKey];
      }) - minPadding;

      xScale.domain([min, max])
        .range([padding, w - padding]);
      svg.select("#xAxis").transition(300).call(xAxis);

      paths.attr("transform", function (d) {
        return "translate(" + xScale(d[xDropdownKey]) + "," + yScale(d[yDropdownKey]) + "), scale(" + wScale(d[sizeDropdownKey]) / 40 + ")";
      });
    }

    // if the y dropdown changed
    else if (this.id == "yDropdown") {
      max = d3.max(data, function (d) {
        return +d[yDropdownKey];
      });
      min = d3.min(data, function (d) {
        return +d[yDropdownKey];
      }) - minPadding;

      yScale.domain([min, max])
        .range([h - padding, padding]);
      svg.select("#yAxis").transition(300).call(yAxis);

      paths.attr("transform", function (d) {
        return "translate(" + xScale(d[xDropdownKey]) + "," + yScale(d[yDropdownKey]) + "), scale(" + wScale(d[sizeDropdownKey]) / 40 + ")";
      });
    }

    // if the size dropdown changed
    else if (this.id == "sizeDropdown") {
      console.log(max);

      // scale the symbols and keep them at their current location
      paths.attr("transform", function (d) {
        return "translate(" + xScale(d[xDropdownKey]) + "," + yScale(d[yDropdownKey]) + "), scale(" + wScale(d[sizeDropdownKey]) / 40 + ")";
      });
    }
  }

  //  function to hide data points based on user controlled filters (checkboxes)
  function toggleType() {
    // console.log(this);
    var path = svg.selectAll("path")
      .transition()
      .duration(200)
      .ease("quad");

    //parallel lines
    var parallelLines = d3.selectAll("#parallel-lines .foreground path")
      .transition()
      .duration(200)
      .ease("quad");

    // show/hide using opacity property depending if the checkbox is checked or not
    display = $('#' + this.htmlFor).is(":checked") ? "block" : "none";

    if (this.htmlFor == "" + irisTypes[0] + "-checkbox") {
      path.filter("[name=\"" + irisTypes[0] + "\"]")
        .style("display", display);
      parallelLines.filter("[class=\"" + irisTypes[0] + "\"]")
        .style("display", display);
    } else if (this.htmlFor == "" + irisTypes[1] + "-checkbox") {
      path.filter("[name=\"" + irisTypes[1] + "\"]")
        .style("display", display);
      parallelLines.filter("[class=\"" + irisTypes[1] + "\"]")
        .style("display", display);
    } else if (this.htmlFor == "" + irisTypes[2] + "-checkbox") {
      path.filter("[name=\"" + irisTypes[2] + "\"]")
        .style("display", display);
      parallelLines.filter("[class=\"" + irisTypes[2] + "\"]")
        .style("display", display);
    }
  }

// brush functions
  function brushstart() {
    var svgs = d3.selectAll("svg");
    // add sleecting classs to the two charts when selecting
    svgs.classed("selecting", true);
  }

  function brushCb() {
    var symbols = d3.selectAll("body #scatter-plot path:not(.domain)");
    var lines = d3.selectAll(".foreground path:not(.domain)");

    //get active dimensions
    var xDropdownKey = document.getElementById("xDropdown").options[document.getElementById("xDropdown").selectedIndex].value;
    var yDropdownKey = document.getElementById("yDropdown").options[document.getElementById("yDropdown").selectedIndex].value;

    var extent = brush.extent();

    var x0 = extent[0][0],
      y0 = extent[0][1],
      x1 = extent[1][0],
      y1 = extent[1][1];

    // add "selected" class to selected objects when selected
    symbols.classed("selected", function (d) {
      return (x0 <= d[xDropdownKey] && d[xDropdownKey] <= x1 && y0 <= d[yDropdownKey] && d[yDropdownKey] <= y1);
    });

    lines.classed("selected", function (d) {
      return (x0 <= d[xDropdownKey] && d[xDropdownKey] <= x1 && y0 <= d[yDropdownKey] && d[yDropdownKey] <= y1);
    });
  }

  function brushend() {
    // remove selected class from charts when selecting ends and if the selection is empty
    var svgs = d3.selectAll("svg");
    svgs.classed("selecting", !d3.event.target.empty());
  }
}