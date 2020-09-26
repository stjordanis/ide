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

        ///////////
        /// Box ///
        ///////////

        let margin = {top: 10, right: 10, bottom: 35, left: 40};
        if (axis.x.label === undefined && axis.y.label === undefined) {
            margin = {top: 20, right: 20, bottom: 20, left: 20};
        } else if (axis.x.label === undefined) {
            margin = {top: 10, right: 20, bottom: 35, left: 20};
        } else if (axis.y.label === undefined) {
            margin = {top: 20, right: 10, bottom: 20, left: 40};
        }

        let svg = d3.select(divElem)
            .append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        width  = width - margin.left - margin.right;
        height = height - margin.top - margin.bottom;

        let xMin = dataPoints[0].x;
        let xMax = dataPoints[0].x;

        dataPoints.forEach(d => {
            if (d.x < xMin) { xMin = d.x }
            if (d.x > xMax) { xMax = d.x }
        });

        let dx = xMax - xMin;
        dx = 0.15 * dx;

        //////////////
        /// Labels ///
        //////////////

        if(axis.x.label !== undefined) {
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("style","font-family: dejavuSansMono; font-size: 11px;")
                .attr("x", width / 2 + margin.left)
                .attr("y", height + margin.top + 20)
                .text(axis.x.label);
        }

        /////////////

        if(axis.y.label !== undefined) {
            svg.append("text")
                .attr("text-anchor", "end")
                .attr("style","font-family: dejavuSansMono; font-size: 11px;")
                .attr("transform", "rotate(-90)")
                .attr("y", -margin.left + 10)
                .attr("x", -margin.top - height / 2 + 30)
                .text(axis.y.label);
        }

        //////////////

        let x = d3.scaleLinear()
            .domain([xMin - dx, xMax + dx])
            .range([0, width]);
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        //////////////

        let histogram = d3.histogram()
            .value( d => d.x )
            .domain(x.domain())
            .thresholds(x.ticks(70));

        let bins = histogram(dataPoints);

        //////////////

        let y = d3.scaleLinear()
            .range([height, 0]);
        y.domain([0, d3.max(bins, d => d.length )]);
        svg.append("g")
            .call(d3.axisLeft(y));

        //////////////

        svg.selectAll("rect")
            .data(bins)
            .enter()
            .append("rect")
            .attr("x", 1)
            .attr("transform", d => "translate(" + x(d.x0) + "," + y(d.length) + ")" )
            .attr("width", d => x(d.x1) - x(d.x0) -1 )
            .attr("height", d => height - y(d.length) )
            .style("fill", "#00E890")
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
