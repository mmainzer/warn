
const width = $(window).width() * .5;
const height = $(window).height() * .3;
const margin = {top: 10, right: 10, bottom: 30, left: 30};
const graphWidth = width - margin.left - margin.right;
const graphHeight = height - margin.top - margin.bottom;

// function to insert objects into an array
// at a specific index
// this is to make sure all dates are represented for the bar chart
const getDates = () => {
    dateOrder = [];
    dates = [];
    console.log(years);
    years.forEach(year => {
      dateOrder.push("Jan "+year);
      dates.push({date:"Jan "+year, Employees:0});
      dateOrder.push("Feb "+year);
      dates.push({date:"Feb "+year, Employees:0});
      dateOrder.push("Mar "+year);
      dates.push({date:"Mar "+year, Employees:0});
      dateOrder.push("Apr "+year);
      dates.push({date:"Apr "+year, Employees:0});
      dateOrder.push("May "+year);
      dates.push({date:"May "+year, Employees:0});
      dateOrder.push("Jun "+year);
      dates.push({date:"Jun "+year, Employees:0});
      dateOrder.push("Jul "+year);
      dates.push({date:"Jul "+year, Employees:0});
      dateOrder.push("Aug "+year);
      dates.push({date:"Aug "+year, Employees:0});
      dateOrder.push("Sep "+year);
      dates.push({date:"Sep "+year, Employees:0});
      dateOrder.push("Oct "+year);
      dates.push({date:"Oct "+year, Employees:0});
      dateOrder.push("Nov "+year);
      dates.push({date:"Nov "+year, Employees:0});
      dateOrder.push("Dec "+year);
      dates.push({date:"Dec "+year, Employees:0});
    });
}


// const dateOrder = ["Jan 2020","Feb 2020","Mar 2020", "Apr 2020","May 2020","Jun 2020","Jul 2020","Aug 2020","Sep 2020","Oct 2020","Nov 2020","Dec 2020"];
// const dates = [
//   {date:"Jan 2020",Employees:0},
//   {date:"Feb 2020",Employees:0},
//   {date:"Mar 2020",Employees:0},
//   {date:"Apr 2020",Employees:0},
//   {date:"May 2020",Employees:0},
//   {date:"Jun 2020",Employees:0},
//   {date:"Jul 2020",Employees:0},
//   {date:"Aug 2020",Employees:0},
//   {date:"Sep 2020",Employees:0},
//   {date:"Oct 2020",Employees:0},
//   {date:"Nov 2020",Employees:0},
//   {date:"Dec 2020",Employees:0}
// ];

const sortArray = (array, order) => {
  const orderForIndex = order.slice(0).reverse();
  array.sort((a,b) => {
    const aIndex = -orderForIndex.indexOf(a.date);
    const bIndex = -orderForIndex.indexOf(b.date);
    return aIndex - bIndex;
  });
}

const svg = d3.select('#barChart')
                .append('svg')
                .attr('width', width)
                .attr('height', height);

graph = svg.append('g')
              .attr('width', graphWidth)
              .attr('height', graphHeight)
              .attr('transform', 'translate('+margin.left+','+margin.top+')');

const buildBarChart = (data) => {

  console.log("Building Bar Chart");
  getDates();
  // make sure each date is represented in the object
  dates.forEach(element => {
    data.push(element);
  });

  data.reduce(function(res, value) {
        if (!res[value.date]) {
          res[value.date] = { date: value.date, Employees: value.Employees };
          barData.push(res[value.date])
        } else
        res[value.date].Employees += value.Employees;
        return res
      }, {});
  // after the rollup, correctly sort the dates
  sortArray(barData, dateOrder);

  y = d3.scaleLinear()
              .domain([ 0, d3.max(barData, d => d.Employees) + 10 ])
              .range([ graphHeight, 0 ]);

  x = d3.scaleBand()
              .range([ 0, width ])
              .domain(barData.map(d => d.date))
              .padding(0.2);

  xAxis = d3.axisBottom(x).tickValues(x.domain().filter(function(d,i){ return !(i%2)}));

  yAxis = d3.axisLeft(y).ticks(5).tickFormat(d3.format("~s"));

  graph.append("g")
      .attr('transform', 'translate(0,'+graphHeight+')')
      .attr('class','x axis')
      .call(xAxis);

  graph.append("g")
      .attr('class','y axis')
      .call(yAxis);

  barChart = graph.selectAll("barChart")
                      .data(barData)
                      .enter()
                      .append("rect")
                        .attr("class", "bar employees")
                        .attr("x", d => x(d.date))
                        .attr("y", d => y(d.Employees))
                        .attr("date", (d) => d.date)
                        .attr("employees", (d) => d.Employees)
                        .attr("width", x.bandwidth())
                        .attr("height", function(d) { return graphHeight - y(d.Employees); })
                        .attr("fill", "#003a5d");

}

const updateBarChart = (data) => {
  getDates();
  console.log(dates);
  console.log(dateOrder);
  
  // make sure each date is represented in the object
  dates.forEach(element => {
    data.push(element);
  });

  // set barData to empty again
  barData = [];

  data.reduce(function(res, value) {
        if (!res[value.date]) {
          res[value.date] = { date: value.date, Employees: value.Employees };
          barData.push(res[value.date])
        } else
        res[value.date].Employees += value.Employees;
        return res
      }, {});

  sortArray(barData, dateOrder);
  console.log(barData);
  let xTicks = years.length + years.length;
  console.log(xTicks);

  // update the domains for the axes with new data
  y.domain([ 0, d3.max(barData, d => d.Employees) + 10 ]);
  x.domain(barData.map(d => d.date));

  barChart
    .data(barData)
    .enter()
    .append("rect")
    .merge(barChart)
    .transition()
    .duration(1000)
    .attr("x", d => x(d.date))
    .attr("y", d => y(d.Employees))
    .attr("width", x.bandwidth())
    .attr("height", function(d) { return graphHeight - y(d.Employees); })
    .attr("fill", "#003a5d");

  barChart
    .data(barData)
    .exit()
    .remove()

  // update the y axis
  graph.select('.y.axis')
        .transition()
        .duration(1000)
        .call(d3.axisLeft(y).ticks(5).tickFormat(d3.format("~s")));

  // update the x axis
  graph.select('.x.axis')
        .transition()
        .duration(1000)
        .call(d3.axisBottom(x).tickValues(x.domain().filter(function(d,i){ return !(i%xTicks)})));

}

