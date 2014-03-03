d3.csv("http://www.sfu.ca/siatclass/IAT355/Spring2014/DataSets/IrisDataset.csv", function (error, data) {
  if (error) throw error;

  drawScatterPlot(data);
  drawParallelLines(data);
});