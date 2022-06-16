
function createSVGChart(element, options, data) {
    var SVG_NS = "http://www.w3.org/2000/svg",
        slice = Array.prototype.slice;

    var defaultProperties = {
        viewBox: "0 0 100 100",
        min: 0,
        max: 100,
        strokeWidth: 0.5,
        strokeColor: 'black',
        fillColor: 'darkgrey',
        aspectRatio: 2, //(width/height)
        type: 'line',// line / area ./bar
        barColorFunc: null,
        barCap: 'butt',
        barColor: 'black',
        barWidth: 1,
        showPoints: false,
        pointRadius: 1,
        pointStrokeWidth: 1,
        pointStrokeColor: 'black',
        pointFillColor: 'none'
    };

    var opts = shallowCopy({}, defaultProperties, options);
    opts.viewBox = '0 0 100 ' + 100 / opts.aspectRatio;
    opts.yFactor = 100 / opts.aspectRatio;

    var instance = null;

    function shallowCopy(/* source, ...targets*/) {
        var target = arguments[0], sources = slice.call(arguments, 1);
        sources.forEach(function (s) {
            for (var k in s) {
                if (s.hasOwnProperty(k)) {
                    target[k] = s[k];
                }
            }
        });
        return target;
    }

    /**
     * A utility function to create SVG dom tree
     * @param {String} name The SVG element name
     * @param {Object} attrs The attributes as they appear in DOM e.g. stroke-width and not strokeWidth
     * @param {Array} children An array of children (can be created by this same function)
     * @return The SVG element
     */
    function svg(name, attrs, children) {
        var elem = document.createElementNS(SVG_NS, name);
        for (var attrName in attrs) {
            elem.setAttribute(attrName, attrs[attrName]);
        }
        if (children) {
            children.forEach(function (c) {
                if (c !== null) {
                    elem.appendChild(c);
                }
            });
        }
        return elem;
    }


    function createPolygonElement(points, strokeColor, width, classStr, fillColor) {
        return svg("polygon", {
            "class": classStr,
            points: points,
            fill: fillColor || 'none',
            stroke: strokeColor,
            "stroke-width": width
        });
    }

    function createCircleElement(cx, cy, rad, strokeColor, width, classStr, fillColor) {
        return svg("circle", {
            "class": classStr,
            cx: cx,
            cy: cy,
            r: rad,
            fill: fillColor || 'none',
            stroke: strokeColor,
            "stroke-width": width
        });
    }

    function createLineElement(p1, p2, width, color, classStr, lineCap) {
        return svg("line", {
            "class": classStr,
            stroke: color,
            "stroke-linecap": lineCap || 'butt',
            "stroke-width": width,
            x1: p1.x,
            y1: p1.y,
            x2: p2.x,
            y2: p2.y
        });
    }

    function getPointsString(points) {
        var pointsStr = "";
        for (var i = 0; i < points.length; i++) {
            pointsStr += points[i].x.toString() + " " + points[i].y.toString() + " ";
        }
        return pointsStr.trim();
    }

    function getPoints(data) {
        var points = [];
        var xFactor=0;
        if (data.length!==1)        {
            xFactor = 100 / (data.length - 1);
        }
       //F var xFactor = 100 / (data.length - 1);
        var ydiff = opts.max - opts.min;
        for (var i = 0; i < data.length; i++) {
            var point = {
                x: xFactor * i,
                y: ((opts.max - data[i]) / ydiff) * opts.yFactor
            }
            points.push(point);
        }
        return points;
    }
    function getPolyPoints(points, data) {
        var pnts = [];
        var ydiff = opts.max - opts.min;
        var yZero = (opts.max / ydiff) * opts.yFactor;
        var ps = {
            x: -40,
            y: yZero
        };

        var pe = {
            x: 140,
            y: yZero
        };

        pnts.push(ps);
        Array.prototype.push.apply(pnts, points);
        pnts.push(pe);

        var pointsStr = getPointsString(pnts);

        return pointsStr;
    }

    function getBarElements(data) {
        var elems = [];

        var xFactor = 100 / (data.length) / 2;
        var ydiff = opts.max - opts.min;
        var yZero = (opts.max / ydiff) * opts.yFactor;
        for (var i = 0; i < data.length; i++) {
            var px = (2 * xFactor * i) + xFactor;
            var py = ((opts.max - data[i]) / ydiff) * opts.yFactor;
            var p1 = {
                x: px,
                y: yZero
            };
            var p2 = {
                x: px,
                y: py
            };
            var color = opts.barColor;
            if (opts.barColorFunc !== null) {
                color = opts.barColorFunc.call(opts, data[i]);
            }
            var elem = createLineElement(p1, p2, opts.barWidth, color, null, opts.barCap);
            elems.push(elem);
        }
        return elems;
    }

    function initializeChart(element) {
        if (data.length === 0) {
            return
        }
        var childs = [];
        var points = getPoints(data);

        if (opts.type === 'bar') {
            childs = getBarElements(data);
        } else if (opts.type === 'line' && data.length !== 1) {
            var pointsStr = getPolyPoints(points, data);
            var elem = createPolygonElement(pointsStr, opts.strokeColor, opts.strokeWidth, null, 'none');
            childs.push(elem);

        } else if (opts.type === 'area' && data.length !== 1) {
            var pointsStr = getPolyPoints(points, data);
            var elem = createPolygonElement(pointsStr, opts.strokeColor, opts.strokeWidth, null, opts.fillColor);
            childs.push(elem);
        }
        if (opts.showPoints || (opts.type !== 'bar' && data.length === 1)) {
            for (var p of points) {
                var elem = createCircleElement(p.x, p.y, opts.pointRadius,
                    opts.pointStrokeColor, opts.pointStrokeWidth,
                    null, opts.pointFillColor);
                childs.push(elem);
            }
        }
        var chartElement = svg("svg",
            { "viewBox": opts.viewBox }, childs);

        element.appendChild(chartElement);
    }

    function refreshChart() {
        //Clean all elements and redraw
        element.innerHTML = '';
        initializeChart(element);
    }

    instance = {
        refreshData: function (newdata) {
            data = newdata;
            refreshChart();
        },
        getOpts: function () {
            return opts;
        }
    };

    initializeChart(element);

    return instance;
}