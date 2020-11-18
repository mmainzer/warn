
const width = $(window).width() * .5;
const height = $(window).height() * .333;
const margin = {top: 20, right: 20, bottom: 100, left: 100};
const graphWidth = width - margin.left - margin.right;
const graphHeight = height - margin.top - margin.bottom;

const svg = d3.select('#barChart')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

const graph = svg.append('g')
                  .attr('width', graphWidth)
                  .attr('height', graphHeight)
                  .attr('transform', `translate(${margin.left}, ${margin.top})`);

const xAxis = graph.append('g')
                    .attr('transform', `translate(0, ${graphHeight}`);

const yAxis = graph.append('g');

const buildBarChart = (data) => {

  console.log("Building Bar Chart");
  console.log(data);
  console.log(width);
  console.log(height);

}