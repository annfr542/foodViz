import React from "react";
import * as d3 from "d3";
import root from "../countryCategories.json";
import "../style/sunburst.css";

class SuperChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentDidMount() {
    createChart(root, ".superChart");
  }

  render() {
    return <div className="superChart" style={{ display: "inline-flex" }}></div>;
  }
}

export default SuperChart;

const max = Math.max;
const sin = Math.sin;
const cos = Math.cos;
const HALF_PI = Math.PI / 2;

function partition(data) {
  const root = d3
    .hierarchy(data)
    .sum((d) => d.value)
    .sort((a, b) => b.value - a.value);
  return d3.partition().size([2 * Math.PI, root.height + 1])(root);
}

function createChart(sunburstData, id) {
  let radius = 150;
  let arcRadius = 30;
  const cfg = {
    w: 450, //Width of the circle
    h: 450, //Height of the circle
    radius: radius,
    margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
    levels: 3, //How many levels or inner circles should there be drawn
    maxValue: 0, //What is the value that the biggest circle will represent
    labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
    wrapWidth: 60, //The number of pixels after which a label needs to be given a new line
    opacityArea: 0.15, //The opacity of the area of the blob
    dotRadius: 2, //The size of the colored circles of each blog
    opacityCircles: 0.1, //The opacity of the circles of each blob
    strokeWidth: 2, //The width of the stroke around each blob
    roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed)
    color: d3.scaleOrdinal(
      d3.quantize(d3.interpolateRainbow, sunburstData.children.length + 1)
    ), //Color function,
    colorRadar: d3.scaleOrdinal().range(["#26AF32", "#762712"]),
    format: d3.format(".1f"),
    unit: "",
    legend: { title: "Scenario", translateX: 200, translateY: 40 },
    arc: d3
      .arc()
      .startAngle((d) => d.x0)
      .endAngle((d) => d.x1)
      .padAngle((d) => Math.min((d.x1 - d.x0) / 2, 0.005))
      .padRadius(radius * 1.5)
      .innerRadius((d) => d.y0 * arcRadius + radius)
      .outerRadius((d) => Math.max(d.y0 * arcRadius, d.y1 * arcRadius - 1) + radius),
  };
  // prepare categories data
  const root = partition(sunburstData);
  root.each((d) => {
    d.current = d;
    d.target = d;
  });

  // prepare radar data
  let radarData = rootToRadarData(root);
  let maxValue = max(cfg.maxValue, getMax(radarData));
  let allAxis = radarData[0].axes.map((i, j) => i.axis), //Names of each axis
    total = allAxis.length, //The number of different axes
    angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"

  //Scale for the radius
  const rScale = d3.scaleLinear().range([0, radius]).domain([0, maxValue]);

  const svgParent = d3.select(id);
  svgParent.select("svg").remove();

  //Initiate the radar chart SVG
  let svg = svgParent
    .append("svg")
    .attr("width", cfg.w + cfg.margin.left + cfg.margin.right)
    .attr("height", cfg.h + cfg.margin.top + cfg.margin.bottom);

  //Append a g element
  let g = svg
    .append("g")
    .attr(
      "transform",
      "translate(" +
        (cfg.w / 2 + cfg.margin.left) +
        "," +
        (cfg.h / 2 + cfg.margin.top) +
        ")"
    );

  let filter = g.append("defs").append("filter").attr("id", "glow"),
    feGaussianBlur = filter
      .append("feGaussianBlur")
      .attr("stdDeviation", "2.5")
      .attr("result", "coloredBlur"),
    feMerge = filter.append("feMerge"),
    feMergeNode_1 = feMerge.append("feMergeNode").attr("in", "coloredBlur"),
    feMergeNode_2 = feMerge.append("feMergeNode").attr("in", "SourceGraphic");

  var defs = svg.append("defs");

  //Create a radial Sun-like gradient
  defs
    .append("radialGradient")
    .attr("id", "sun-gradient")
    .attr("cx", "50%") //not really needed, since 50% is the default
    .attr("cy", "50%") //not really needed, since 50% is the default
    .attr("r", "50%") //not really needed, since 50% is the default
    .selectAll("stop")
    .data([
      { offset: "0%", color: "#99d1da" },
      { offset: "85%", color: "#173270" },
      { offset: "100%", color: "#0e0e0e" },
    ])
    .enter()
    .append("stop")
    .attr("offset", function (d) {
      return d.offset;
    })
    .attr("stop-color", function (d) {
      return d.color;
    });

  //Wrapper for the grid & axes
  let axisGrid = g.append("g").attr("class", "axisWrapper");

  //Draw the background circles
  axisGrid
    .selectAll(".levels")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("circle")
    .attr("class", "gridCircle")
    .attr("r", (d) => (radius / cfg.levels) * d)
    .style("fill", "none")
    .style("stroke", "#CDCDCD")
    .style("stroke-opacity", cfg.opacityCircles);

  //Text indicating at what % each level is
  axisGrid
    .selectAll(".axisLabel")
    .data(d3.range(1, cfg.levels + 1).reverse())
    .enter()
    .append("text")
    .attr("class", "axisLabel")
    .attr("x", 4)
    .attr("y", (d) => (-d * radius) / cfg.levels)
    .attr("dy", "0.4em")
    .style("font-size", "11px")
    .attr("fill", "white")
    .text((d) => cfg.format((maxValue * d) / cfg.levels) + cfg.unit);

  // Append title food Sufficiency
  axisGrid
    .selectAll(".axisLabelMain")
    .data(["Food Sufficiency"])
    .enter()
    .append("text")
    .attr("class", "axisLabelMain")
    .attr("x", 80)
    .attr("y", -5)
    .attr("dy", "0.4em")
    .attr("transform", "rotate(-93)")
    .style("font-size", "15px")
    .attr("fill", "white")
    .text((d) => d);

  /////////////////////////////////////////////////////////
  //////////////////// Draw the axes //////////////////////
  /////////////////////////////////////////////////////////

  //Create the straight lines radiating outward from the center
  var axis = axisGrid
    .selectAll(".axis")
    .data(allAxis)
    .enter()
    .append("g")
    .attr("class", "axis");
  //Append the lines
  axis
    .append("line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", (d, i) => rScale(maxValue * 1.1) * cos(angleSlice * i - HALF_PI))
    .attr("y2", (d, i) => rScale(maxValue * 1.1) * sin(angleSlice * i - HALF_PI))
    .attr("class", "line")
    .style("stroke", "white")
    .style("stroke-opacity", cfg.opacityCircles)
    .style("stroke-width", "1px");

  /////////////////////////////////////////////////////////
  ///////////// Draw the radar chart blobs ////////////////
  /////////////////////////////////////////////////////////

  //The radial line function
  const radarLine = d3
    .radialLine()
    .curve(d3.curveLinearClosed)
    .radius((d) => rScale(d.value))
    .angle((d, i) => i * angleSlice + angleSlice / 2);

  if (cfg.roundStrokes) {
    radarLine.curve(d3.curveCardinalClosed);
  }

  //Create a wrapper for the blobs
  const blobWrapper = g
    .selectAll(".radarWrapper")
    .data(radarData)
    .enter()
    .append("g")
    .attr("class", "radarWrapper");

  //Append the backgrounds
  blobWrapper
    .append("path")
    .attr("class", "radarArea")
    .attr("d", (d) => radarLine(d.axes))
    .style("fill", (d, i) => cfg.colorRadar(i))
    .style("fill-opacity", cfg.opacityArea)
    .style("stroke-width", cfg.strokeWidth + "px")
    .style("stroke", (d, i) => cfg.color(i))
    .style("filter", "url(#glow)");

  //Append the circles
  blobWrapper
    .selectAll(".radarCircle")
    .data((d) => d.axes)
    .enter()
    .append("circle")
    .attr("class", "radarCircle")
    .attr("r", cfg.dotRadius)
    .attr(
      "cx",
      (d, i) => rScale(d.value) * cos(angleSlice * i - HALF_PI + angleSlice / 2)
    )
    .attr(
      "cy",
      (d, i) => rScale(d.value) * sin(angleSlice * i - HALF_PI + angleSlice / 2)
    )
    .style("fill", (d) => cfg.colorRadar(d.id))
    .style("fill-opacity", 0.8);

  ////////////////////////////////////////////////////
  /////////Create the arcs///////////////
  //////////////////////////////////////////////
  const parent = g
    .append("circle")
    .datum(root)
    .attr("r", cfg.radius + 3.5 * arcRadius)
    .attr("pointer-events", "all")
    .attr("fill-opacity", "0.25")
    .on("click", clicked)
    .style("fill", "url(#sun-gradient)");
  let path = g
    .append("g")
    .selectAll("path")
    .data(root.descendants().slice(1))
    .join("path")
    .attr("fill", (d) => {
      while (d.depth > 1) d = d.parent;
      return cfg.color(d.data.name);
    })
    .attr("fill-opacity", (d) => (arcVisible(d.current) ? (d.children ? 0.6 : 0.4) : 0))
    .attr("d", (d) => cfg.arc(d.current));

  path
    .filter((d) => d.children)
    .style("cursor", "pointer")
    .on("click", clicked);

  path.append("title").text((d) => d.data.name + cfg.format(d.value));

  const label = g
    .append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .attr("class", "legend")
    .style("font-size", "11px")
    .style("user-select", "none")
    .selectAll("text")
    .data(root.descendants().slice(1))
    .join("text")
    .attr("dy", "0.35em")
    .attr("fill-opacity", (d) => +labelVisible(d.current))
    .attr("transform", (d) => labelTransform(d.current))
    .text((d) => d.data.name);

  function clicked(p) {
    parent.datum(p.parent || root);
    root.each((d) => {
      d.target = {
        x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
        y0: Math.max(0, d.y0 - p.depth),
        y1: Math.max(0, d.y1 - p.depth),
      };
    });
    let newRadarData = rootToRadarData(root);

    const t = g.transition().duration(750);

    // Transition the data on all arcs, even the ones that aren’t visible,
    // so that if this transition is interrupted, entering arcs will start
    // the next transition from the desired position.
    path
      .transition(t)
      .tween("data", (d) => {
        const i = d3.interpolate(d.current, d.target);
        return (t) => (d.current = i(t));
      })
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || arcVisible(d.target);
      })
      .attr("fill-opacity", (d) => (arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0))
      .attrTween("d", (d) => () => cfg.arc(d.current));

    label
      .filter(function (d) {
        return +this.getAttribute("fill-opacity") || labelVisible(d.target);
      })
      .transition(t)
      .attr("fill-opacity", (d) => +labelVisible(d.target))
      .attrTween("transform", (d) => () => labelTransform(d.current));

    //// change radar

    allAxis = newRadarData[0].axes.map((i, j) => i.axis); //Names of each axis
    total = allAxis.length; //The number of different axes
    angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"

    let newBlobWrapper = g.selectAll(".radarWrapper").data(newRadarData);

    newBlobWrapper.join(
      (enter) =>
        enter
          .append("g")
          .append("path")
          .attr("class", "radarArea")
          .style("fill", (d, i) => cfg.color(i))
          .style("fill-opacity", cfg.opacityArea)
          .style("stroke-width", cfg.strokeWidth + "px")
          .style("stroke", (d, i) => cfg.colorRadar(i))
          .style("filter", "url(#glow)")
          .call((enter) => enter.transition(t).attr("d", (d) => radarLine(d.axes))),
      (update) =>
        update.select("path").call(
          (update) => update.transition(t).attr("d", (d) => radarLine(d.axes)),
          (exit) => exit.remove()
        )
    );

    newBlobWrapper
      .selectAll(".radarCircle")
      .data((d) => d.axes)
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "radarCircle")
            .attr("r", cfg.dotRadius)
            .attr(
              "cx",
              (d, i) => rScale(d.value) * cos(angleSlice * i - HALF_PI + angleSlice / 2)
            )
            .attr(
              "cy",
              (d, i) => rScale(d.value) * sin(angleSlice * i - HALF_PI + angleSlice / 2)
            )
            .style("fill", (d) => cfg.colorRadar(d.id))
            .style("fill-opacity", 0.8),

        (update) =>
          update
            .attr("fill", "black")
            .attr("y", 0)
            .call((update) =>
              update
                .transition(t)
                .attr(
                  "cx",
                  (d, i) =>
                    rScale(d.value) * cos(angleSlice * i - HALF_PI + angleSlice / 2)
                )
                .attr(
                  "cy",
                  (d, i) =>
                    rScale(d.value) * sin(angleSlice * i - HALF_PI + angleSlice / 2)
                )
            ),
        (exit) => exit.remove()
      );

    let newAxis = axisGrid.selectAll(".axis").data(allAxis);

    newAxis.join(
      (enter) =>
        enter
          .append("g")
          .attr("class", "axis")
          .append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("class", "line")
          .style("stroke", "white")
          .style("stroke-opacity", cfg.opacityCircles)
          .style("stroke-width", "1px")
          .call((enter) =>
            enter
              .transition(t)

              .attr(
                "x2",
                (d, i) => rScale(maxValue * 1.1) * cos(angleSlice * i - HALF_PI)
              )
              .attr(
                "y2",
                (d, i) => rScale(maxValue * 1.1) * sin(angleSlice * i - HALF_PI)
              )
          ),
      (update) =>
        update.select("line").call((update) =>
          update
            .transition(t)
            .attr("x2", (d, i) => rScale(maxValue * 1.1) * cos(angleSlice * i - HALF_PI))
            .attr("y2", (d, i) => rScale(maxValue * 1.1) * sin(angleSlice * i - HALF_PI))
        ),
      (exit) => exit.remove()
    );
  }

  function arcVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
  }

  function isChildVisible(d) {
    return d.x1 - d.x0 > 0.001;
  }

  function labelVisible(d) {
    return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.03;
  }

  function labelTransform(d) {
    const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
    const y = ((d.y0 + d.y1) / 2) * arcRadius + cfg.radius;
    return `rotate(${x - 90}) translate(${y},0) rotate(${x < 270 && x > 90 ? -90 : 90})`;
  }

  function rootToRadarData(root) {
    let outData = [];
    outData.push({ name: "ssp1", axes: [] });
    root.each((d) => {
      !d.children &&
        isChildVisible(d.target) &&
        outData[0].axes.push({ axis: d.data.name, value: d.data.ssp1 });
    });
    return outData;
  }

  return svg.node();
}

function getMax(data) {
  let maxValue = 0;
  for (let j = 0; j < data.length; j++) {
    for (let i = 0; i < data[j].axes.length; i++) {
      data[j].axes[i]["id"] = data[j].name;
      if (data[j].axes[i]["value"] > maxValue) {
        maxValue = data[j].axes[i]["value"];
      }
    }
  }
  return maxValue;
}
