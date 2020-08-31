import React from "react";
import * as d3 from "d3";
import root from "../fullData.json";
import "../style/sunburst.css";

class SuperChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.drawNewBlobs = () => {};
    this.removeOldBlobs = () => {};
  }

  componentDidMount() {
    this.createChart(root, ".superChart");
  }

  componentDidUpdate() {
    this.removeOldBlobs();
    this.drawNewBlobs(this.props);
  }

  render() {
    return <div className="superChart" style={{ display: "inline-flex" }}></div>;
  }
  createChart = (sunburstData, id) => {
    let radius = 180;
    let arcRadius = 30;
    const cfg = {
      w: 520, //Width of the circle
      h: 520, //Height of the circle
      radius: radius,
      margin: { top: 20, right: 20, bottom: 20, left: 20 }, //The margins of the SVG
      levels: 3, //How many levels or inner circles should there be drawn
      maxValue: 10, //What is the value that the biggest circle will represent
      labelFactor: 1.25, //How much farther than the radius of the outer circle should the labels be placed
      wrapWidth: 30, //The number of pixels after which a label needs to be given a new line
      opacityArea: 0.15, //The opacity of the area of the blob
      dotRadius: 2, //The size of the colored circles of each blog
      opacityCircles: 0.1, //The opacity of the circles of each blob
      strokeWidth: 2, //The width of the stroke around each blob
      roundStrokes: true, //If true the area and stroke will follow a round path (cardinal-closed)
      color: (d) => {
        return d === "Greatest concern"
          ? "#660000"
          : d === "Mild concern"
          ? "#664934"
          : d === "Improving"
          ? "#30661a"
          : d === "Currently trade driven"
          ? "#414566"
          : "gray";
      },
      colorRadar: (d) => {
        return d === "ssp1"
          ? "#4a8422"
          : d === "ssp2"
          ? "#2f6da4"
          : d === "ssp3"
          ? "#c55a11"
          : d === "ssp4"
          ? "#d29500"
          : d === "ssp5"
          ? "#66547f"
          : "gray";
      },
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
    let maxValue = cfg.maxValue > 0 ? cfg.maxValue : getMax(radarData);
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
    let radarWrapper = g.append("g").attr("class", "radarWrapper");

    updateBlobs(this.props);

    ////////////////////////////////////////////////////
    /////////Append food sufficiency legend///////////////
    //////////////////////////////////////////////

    //Wrapper for the grid & axes
    let legend = g.append("g").attr("class", "axisWrapper");

    //Text indicating at what each level is
    legend
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
    legend
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

    ////////////////////////////////////////////////////
    /////////Create the arcs///////////////
    //////////////////////////////////////////////
    const parent = g
      .append("circle")
      .datum(root)
      .attr("id", "arcSelection")
      .attr("r", cfg.radius + 3.5 * arcRadius)
      .attr("pointer-events", "all")
      .attr("fill-opacity", "0.25")
      .on("click", (p) => clicked(p, this.props))
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
      .on("click", (p) => clicked(p, this.props));

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

    function clicked(p, props) {
      parent.datum(p.parent || root);
      props.updateState(p.data.name);
      root.each((d) => {
        d.target = {
          x0: Math.max(0, Math.min(1, (d.x0 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          x1: Math.max(0, Math.min(1, (d.x1 - p.x0) / (p.x1 - p.x0))) * 2 * Math.PI,
          y0: Math.max(0, d.y0 - p.depth),
          y1: Math.max(0, d.y1 - p.depth),
        };
      });
      // update data for blobs
      radarData = rootToRadarData(root);

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
        .attr("fill-opacity", (d) =>
          arcVisible(d.target) ? (d.children ? 0.6 : 0.4) : 0
        )
        .attrTween("d", (d) => () => cfg.arc(d.current));

      label
        .filter(function (d) {
          return +this.getAttribute("fill-opacity") || labelVisible(d.target);
        })
        .transition(t)
        .attr("fill-opacity", (d) => +labelVisible(d.target))
        .attrTween("transform", (d) => () => labelTransform(d.current));

      //// change radar

      allAxis = radarData[0].axes.map((i, j) => i.axis); //Names of each axis
      total = allAxis.length; //The number of different axes
      angleSlice = (Math.PI * 2) / total; //The width in radians of each "slice"
      updateBlobs(props);

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
              .attr(
                "x2",
                (d, i) => rScale(maxValue * 1.1) * cos(angleSlice * i - HALF_PI)
              )
              .attr(
                "y2",
                (d, i) => rScale(maxValue * 1.1) * sin(angleSlice * i - HALF_PI)
              )
          ),
        (exit) => exit.remove()
      );
    }

    function updateBlobs(props) {
      const t = g.transition().duration(750);
      let data = radarData.filter((d) => {
        return (
          (d.name === "current" && props.buttons[0].active) ||
          (d.name === "ssp1" && props.buttons[1].active) ||
          (d.name === "ssp2" && props.buttons[2].active) ||
          (d.name === "ssp3" && props.buttons[3].active) ||
          (d.name === "ssp4" && props.buttons[4].active) ||
          (d.name === "ssp5" && props.buttons[5].active)
        );
      });

      //Create a wrapper for the blobs
      const blobWrapper = radarWrapper.selectAll(".radarArea").data(data);

      blobWrapper.join(
        (enter) => {
          enter
            .append("g")
            .attr("class", "radarArea")
            .append("path")
            .style("fill", (d, i) => cfg.colorRadar(d.name))
            .style("fill-opacity", cfg.opacityArea)
            .style("stroke-width", cfg.strokeWidth + "px")
            .style("stroke", (d, i) => cfg.colorRadar(d.name))
            .style("filter", "url(#glow)")
            .call((enter) => enter.transition(t).attr("d", (d) => radarLine(d.axes)));
        },
        (update) => {
          update
            .select("path")
            .call((update) => update.transition(t).attr("d", (d) => radarLine(d.axes)));
        }
      );
    }

    function reDrawBlobs() {
      radarWrapper.selectAll(".radarArea").remove();
    }

    this.drawNewBlobs = updateBlobs;
    this.removeOldBlobs = reDrawBlobs;

    function arcVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && d.x1 > d.x0;
    }

    function isChildVisible(d) {
      return d.x1 - d.x0 > 0.001;
    }

    function labelVisible(d) {
      return d.y1 <= 3 && d.y0 >= 1 && (d.y1 - d.y0) * (d.x1 - d.x0) > 0.2;
    }

    function labelTransform(d) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = ((d.y0 + d.y1) / 2) * arcRadius + cfg.radius;
      return `rotate(${x - 90}) translate(${y},0) rotate(${
        x < 270 && x > 90 ? -90 : 90
      })`;
    }

    function rootToRadarData(root) {
      let outData = [];
      outData.push({ name: "current", axes: [] });
      outData.push({ name: "ssp1", axes: [] });
      outData.push({ name: "ssp2", axes: [] });
      outData.push({ name: "ssp3", axes: [] });
      outData.push({ name: "ssp4", axes: [] });
      outData.push({ name: "ssp5", axes: [] });
      root.each((d) => {
        if (!d.children && isChildVisible(d.target)) {
          outData[0].axes.push({ axis: d.data.name, value: d.data.data[0] });
          outData[1].axes.push({ axis: d.data.name, value: d.data.data[1] });
          outData[2].axes.push({ axis: d.data.name, value: d.data.data[2] });
          outData[3].axes.push({ axis: d.data.name, value: d.data.data[3] });
          outData[4].axes.push({ axis: d.data.name, value: d.data.data[4] });
          outData[5].axes.push({ axis: d.data.name, value: d.data.data[5] });
        }
      });
      return outData;
    }

    return svg.node();
  };
}

export default SuperChart;

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
