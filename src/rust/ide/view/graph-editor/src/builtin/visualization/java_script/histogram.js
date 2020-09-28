function loadScript(url) {
    let script = document.createElement("script");
    script.src = url;

    document.head.appendChild(script);
}

loadScript('https://d3js.org/d3.v4.min.js');

/**
 * A d3.js histogram visualization.
 *
 *
 * Data format (json):
 * {
 *  "axis" : {
 *     "x" : { "label" : "x-axis label" },
 *     "y" : { "label" : "y-axis label" },
 *  },
 *  "data" : [
 *     { "x" : 0.1},
 *     ...
 *     { "x" : 0.4}
 *  ]
 * }
 */
class Histogram extends Visualization {
    static inputType = "Any"
    static label     = "Histogram (JS)"

    onDataReceived(data) {
        while (this.dom.firstChild) {
            this.dom.removeChild(this.dom.lastChild);
        }

        let width     = this.dom.getAttributeNS(null, "width");
        let height    = this.dom.getAttributeNS(null, "height");
        const divElem = this.createDivElem(width, height);

        let parsedData = JSON.parse(data);
        let axis       = parsedData.axis;
        let dataPoints = parsedData.data;

        let margin     = this.getMargins(axis);
        let box_width  = width - margin.left - margin.right;
        let box_height = height - margin.top - margin.bottom;

        let svg = d3.select(divElem)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        let {xMin, xMax, padding_x} = this.getExtremesAndDelta(dataPoints);

        this.setLabels(axis, svg, box_width, margin, box_height);

        let {x, xAxis, y} = this.createHistogram(xMin, padding_x, xMax, box_width, svg, box_height, dataPoints);

        this.setBrushing(box_width, box_height, svg, x, xMin, padding_x, xMax, xAxis, y);
    }

    setBrushing(box_width, box_height, svg, x, xMin, padding_x, xMax, xAxis, y) {
        let brush = d3.brushX()
            .extent([[0, 0], [box_width, box_height]])
            .on("end", updateChart)

        svg.append("g")
            .attr("class", "brush")
            .call(brush);

        let idleTimeout

        function idled() {
            idleTimeout = null;
        }

        function updateChart() {
            let extent = d3.event.selection;

            if (!extent) {
                if (!idleTimeout) return idleTimeout = setTimeout(idled, 350);
                x.domain([xMin - padding_x, xMax + padding_x]);
            } else {
                x.domain([x.invert(extent[0]), x.invert(extent[1])]);
                svg.select(".brush").call(brush.move, null);
            }

            xAxis.transition().duration(1000).call(d3.axisBottom(x));
            svg.selectAll("rect")
                .transition().duration(1000)
                .attr("transform", d => "translate(" + x(d.x0) + "," + y(d.length) + ")")
        }
    }

    createHistogram(xMin, padding_x, xMax, box_width, svg, box_height, dataPoints) {
        let x = d3.scaleLinear()
            .domain([xMin - padding_x, xMax + padding_x])
            .range([0, box_width]);
        let xAxis = svg.append("g")
            .attr("transform", "translate(0," + box_height + ")")
            .call(d3.axisBottom(x));

        let histogram = d3.histogram()
            .value(d => d.x)
            .domain(x.domain())
            .thresholds(x.ticks(70));

        let bins = histogram(dataPoints);

        let y = d3.scaleLinear()
            .range([box_height, 0]);
        y.domain([0, d3.max(bins, d => d.length)]);
        svg.append("g")
            .call(d3.axisLeft(y));

        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", d => "translate(" + x(d.x0) + "," + y(d.length) + ")")
            .attr("width", d => x(d.x1) - x(d.x0) - 1)
            .attr("height", d => box_height - y(d.length))
            .style("fill", "#00E890")

        return {x, xAxis, y};
    }

    setLabels(axis, svg, box_width, margin, box_height) {
        let label_style = "font-family: dejavuSansMono; font-size: 11px;";
        if (axis.x.label !== undefined) {
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("style", label_style)
                .attr("x", box_width / 2 + margin.left)
                .attr("y", box_height + margin.top + 20)
                .text(axis.x.label);
        }

        if (axis.y.label !== undefined) {
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("style", label_style)
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 10)
                .attr("x", -margin.top - box_height / 2 + 30)
                .text(axis.y.label);
        }
    }

    getExtremesAndDelta(dataPoints) {
        let xMin = dataPoints[0].x;
        let xMax = dataPoints[0].x;

        dataPoints.forEach(d => {
            if (d.x < xMin) {
                xMin = d.x
            }
            if (d.x > xMax) {
                xMax = d.x
            }
        });

        let dx = xMax - xMin;
        let padding_x = 0.15 * dx;
        return {xMin, xMax, padding_x};
    }

    getMargins(axis) {
        if (axis.x.label === undefined && axis.y.label === undefined) {
            return {top: 20, right: 20, bottom: 20, left: 20};
        } else if (axis.x.label === undefined) {
            return {top: 10, right: 20, bottom: 35, left: 20};
        } else if (axis.y.label === undefined) {
            return {top: 20, right: 10, bottom: 20, left: 40};
        }
        return {top: 10, right: 10, bottom: 35, left: 40};
    }

    createDivElem(width, height) {
        const divElem = document.createElementNS(null, "div");
        divElem.setAttributeNS(null, "class", "vis-histogram");
        divElem.setAttributeNS(null, "viewBox", 0 + " " + 0 + " " + width + " " + height);
        divElem.setAttributeNS(null, "width", "100%");
        divElem.setAttributeNS(null, "height", "100%");
        divElem.setAttributeNS(null, "transform", "matrix(1 0 0 -1 0 0)");

        this.dom.appendChild(divElem);
        return divElem;
    }

    setSize(size) {
        this.dom.setAttributeNS(null, "width", size[0]);
        this.dom.setAttributeNS(null, "height", size[1]);
    }
}

return Histogram;
