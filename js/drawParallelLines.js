// example code from http://bl.ocks.org/jasondavies/1341281
function drawParallelLines(data) {

  var margin = [30, 0, 10, 0],
    w = 500 - margin[1] - margin[3],
    h = 500 - margin[0] - margin[2];

  var x = d3.scale.ordinal().rangePoints([0, w], 1),
    y = {},
    dragging = {};
  // console.log("x: " + x);
  var line = d3.svg.line(),
    axis = d3.svg.axis().orient("left"),
    background,
    foreground;

  //symbols from the scatter plot
  var symbols = d3.selectAll("body #scatter-plot path:not(.domain)");

  var svg = d3.select("body").append("svg:svg")
    .attr("width", w + margin[1] + margin[3])
    .attr("height", h + margin[0] + margin[2])
    .attr("id", "parallel-lines")
    .append("svg:g")
    .attr("transform", "translate(" + margin[3] + "," + margin[0] + ")");

  drawGraph(data);

  function drawGraph(data) {

    // Extract the list of dimensions and create a scale for each.
    x.domain(dimensions = d3.keys(data[0]).filter(function (d) {
      // return dimensions except for species column
      return d != "Species" && (y[d] = d3.scale.linear()
        .domain(d3.extent(data, function (p) {
          return +p[d];
        }))
        .range([h, 0]));
    }));

    // Add grey background lines for context.
    background = svg.append("svg:g")
      .attr("class", "background")
      .selectAll("path")
      .data(data)
      .enter().append("svg:path")
      .attr("d", path);

    // Add blue foreground lines for focus.
    foreground = svg.append("svg:g")
      .attr("class", "foreground")
      .selectAll("path")
      .data(data)
      .enter()
      .append("svg:path")
      .attr("class", function (d) {
        return d["Species"];
      })
      .attr("d", path)
      .on("mouseover", function (d) {
        showTooltip(d);
      })
      .on("mouseout", function () {
        hideTooltip();
      });

    // Add a group element for each dimension.
    var g = svg.selectAll(".dimension")
      .data(dimensions)
      .enter().append("svg:g")
      .attr("class", "dimension")
      .attr("transform", function (d) {
        return "translate(" + x(d) + ")";
      })
      .call(d3.behavior.drag()
        .on("dragstart", function (d) {
          dragging[d] = this.__origin__ = x(d);
          background.attr("visibility", "hidden");
        })
        .on("drag", function (d) {
          dragging[d] = Math.min(w, Math.max(0, this.__origin__ += d3.event.dx));
          foreground.attr("d", path);
          dimensions.sort(function (a, b) {
            return position(a) - position(b);
          });
          x.domain(dimensions);
          g.attr("transform", function (d) {
            return "translate(" + position(d) + ")";
          })
        })
        .on("dragend", function (d) {
          delete this.__origin__;
          delete dragging[d];
          transition(d3.select(this)).attr("transform", "translate(" + x(d) + ")");
          transition(foreground)
            .attr("d", path);
          background
            .attr("d", path)
            .transition()
            .delay(500)
            .duration(0)
            .attr("visibility", null);
        }));

    // Add an axis and title.
    g.append("svg:g")
      .attr("class", "axis")
      .each(function (d) {
        d3.select(this).call(axis.scale(y[d]));
      })
      .append("svg:text")
      .attr("text-anchor", "middle")
      .attr("y", -9)
      .text(String);

    // Add and store a brush for each axis.
    g.append("svg:g")
      .attr("class", "brush")
      .each(function (d) {
        d3.select(this).call(y[d].brush = d3.svg.brush().y(y[d]).on("brushstart", brush)
          .on("brush", brush)
          .on("brushend", brush));
      })
      .selectAll("rect")
      .attr("x", -8)
      .attr("width", 16);
  }

  function position(d) {
    var v = dragging[d];
    return v == null ? x(d) : v;
  }

  function transition(g) {
    return g.transition().duration(500);
  }

  // Returns the path for a given data point.
  function path(d) {
    return line(dimensions.map(function (p) {
      return [position(p), y[p](d[p])];
    }));
  }

  // Handles a brush event, toggling the display of foreground lines.
  function brush() {
    var actives = dimensions.filter(function (p) {
      return !y[p].brush.empty();
    });
    var extents = actives.map(function (p) {
      return y[p].brush.extent();
    });

    foreground.style("display", function (d) {
      return actives.every(function (p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? null : "none";
    });

    symbols.style("display", function (d) {
      return actives.every(function (p, i) {
        return extents[i][0] <= d[p] && d[p] <= extents[i][1];
      }) ? null : "none";
    });
  }
}