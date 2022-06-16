/**
     * Creates a Gauge object. Various options can be passed for the gauge:
     * {
     *    startAngle: The angle to start the dial. MUST be greater than dialEndAngle. Default 135deg
     *    endAngle: The angle to end the dial. Default 45deg
     *    radius: The gauge's radius. Default 40
     *    max: The maximum value of the gauge. Default 100
     *    value: The starting value of the gauge. Default 0
     *    displayValFunc: The function on how to render the center displayValFunc (Should return a value)
     * }
     * @param {Element} element The DOM into which to render the gauge
     * @param {Object} opts The gauge options
     * @return a Gauge object
     */
function createSVGgaugeWithThreshold(element, options) {
    var SVG_NS = "http://www.w3.org/2000/svg",
        slice = Array.prototype.slice;

    var defaultProperties = {
        centerX: 50,
        centerY: 50,
        viewBox: "0 0 100 100",
        radius: 40,
        startAngle: 135,
        endAngle: 45,
        max: 100,
        min: 0,
        value: 0,

        showValue: true,
        valueColor: 'black',
        valPosOffsetX: 0,
        valPosOffsetY: 20,
        valueFontSize: '100%',
        valueFontWeight: 'normal',
        valueMoveWithGauge: false,
        valueOffsetAngle: 0,
        valueRadiusFactor: 1,

        showMinMax: false,
        minMaxColor: 'black',
        minMaxFontSize: 8,
        minMaxFontWeight: 'normal',
        minMaxOffsetAngle: 12,
        minMaxRadiusFactor: 1.0,

        label: null,
        lableColor: 'black',
        labelOffsetX: 0,
        labelOffsetY: 18,
        labelFontSize: 9,
        labelFontWeight: 'normal',

        trackConf:
            [{
                threshold: 50,
                color: 'darkgreen',
                highlightColor: 'lightGreen',
                segLabel: 'Good'
            }, {
                threshold: 75,
                color: 'orange',
                highlightColor: 'lightorange',
                segLabel: 'Bad'
            }, {
                threshold: 100,
                color: 'brown',
                highlightColor: 'red',
                segLabel: 'Worst'
            }],
        showThresholdLables: true,
        thresholdLablesRadiusFactor: 1.15,
        highlightTrackSeg: false,
        thresholdLabelColor: 'black',
        thresholdLabelSize: 7,
        thresholdLabelWeight: 'normal',
        thresholdStrokeWidth: 5,
        trackLineCap: 'butt',

        showNeedle: true,
        needleColor: 'black',
        needleType: 'line',
        needleStrokeWidth: 1,
        needleStartFactor: 0,
        needleEndFactor: 1.0,
        //for line type
        needleLineCap: 'butt',
        //for poly/triangle
        needleBaseWidth: 5,
        needleStrokeColor: 'black',
        //for polygon
        needlePointsConf: [{
            radiusFactor: 1,
            width: 0
        },
        {
            radiusFactor: 0,
            width: 8
        }, {
            radiusFactor: -.3,
            width: 0
        }],

        needleOnTopofKnob: false,
        showKnob: false,
        knobRadius: 5,
        knobStrokeWidth: 1,
        knobStrokeColor: 'black',
        knobColor: 'black',
        knobStartAngle: 180,
        knobEndAngle: 179.99,

        showPin: false,
        pinColor: 'white',
        pinRadius: 2,
        pinStrokeColor: 'black',
        pinStrokeWidth: 1,

        valueClass: "gt-value-text",
        dialClass: "gt-track-arc",
        gaugeClass: "gt-gauge",
        minMaxTextClass: 'gt-min-max-text',
        knobClass: 'gt-knob',
        needleClass: 'gt-needle',
        pinClass: 'gt-pin',
        labelClass: 'gt-label',
        trackLabelClass: 'gt-track-label',

        displayValFunc: function (val) { return Math.round(val); },
    };

    var opts = shallowCopy({}, defaultProperties, options);

    var centerX = opts.centerX,
        centerY = opts.centerY,
        viewBox = opts.viewBox,
        radius = opts.radius,
        startAngle = opts.startAngle,
        endAngle = opts.endAngle,
        max = opts.max,
        min = opts.min,
        value = options.value || min,

        showValue = opts.showValue,
        valueColor = opts.valueColor,
        valPosOffsetX = opts.valPosOffsetX,
        valPosOffsetY = opts.valPosOffsetY,
        valueFontSize = opts.valueFontSize,
        valueFontWeight = opts.valueFontWeight,
        valueMoveWithGauge = opts.valueMoveWithGauge,
        valueOffsetAngle = opts.valueOffsetAngle,
        valueRadiusFactor = opts.valueRadiusFactor,

        showMinMax = opts.showMinMax,
        minMaxColor = opts.minMaxColor,
        minMaxFontSize = opts.minMaxFontSize,
        minMaxFontWeight = opts.minMaxFontWeight,
        minMaxOffsetAngle = opts.minMaxOffsetAngle,
        minMaxRadiusFactor = opts.minMaxRadiusFactor,

        label = opts.label,
        lableColor = opts.lableColor,
        labelOffsetX = opts.labelOffsetX,
        labelOffsetY = opts.labelOffsetY,
        labelFontSize = opts.labelFontSize,
        labelFontWeight = opts.labelFontWeight,

        trackConf = opts.trackConf,
        showThresholdLables = opts.showThresholdLables,
        thresholdLablesRadiusFactor = opts.thresholdLablesRadiusFactor,
        highlightTrackSeg = opts.highlightTrackSeg,
        thresholdLabelColor = opts.thresholdLabelColor,
        thresholdLabelSize = opts.thresholdLabelSize,
        thresholdLabelWeight = opts.thresholdLabelWeight,
        thresholdStrokeWidth = opts.thresholdStrokeWidth,
        trackLineCap = opts.trackLineCap,

        showNeedle = opts.showNeedle,
        needleColor = opts.needleColor,
        needleType = opts.needleType,
        needleStrokeWidth = opts.needleStrokeWidth,
        needleStartFactor = opts.needleStartFactor,
        needleEndFactor = opts.needleEndFactor,

        needleLineCap = opts.needleLineCap,

        needleBaseWidth = opts.needleBaseWidth,
        needleStrokeColor = opts.needleStrokeColor,

        needlePointsConf = opts.needlePointsConf,

        needleOnTopofKnob = opts.needleOnTopofKnob,
        showKnob = opts.showKnob,
        knobRadius = opts.knobRadius,
        knobStrokeWidth = opts.knobStrokeWidth,
        knobStrokeColor = opts.knobStrokeColor,
        knobColor = opts.knobColor,
        knobStartAngle = opts.knobStartAngle,
        knobEndAngle = opts.knobEndAngle,

        showPin = opts.showPin,
        pinColor = opts.pinColor,
        pinRadius = opts.pinRadius,
        pinStrokeColor = opts.pinStrokeColor,
        pinStrokeWidth = opts.pinStrokeWidth,

        dialClass = opts.dialClass,
        valueTextClass = opts.valueClass,
        gaugeClass = opts.gaugeClass,
        minMaxTextClass = opts.minMaxTextClass,
        knobClass = opts.knobClass,
        needleClass = opts.needleClass,
        pinClass = opts.pinClass,
        labelClass = opts.labelClass,
        trackLabelClass = opts.trackLabelClass,

        displayValFunc = opts.displayValFunc,

        gaugeValueElem = null,
        gaugeTrackPath = null,
        gaugeMinValueElem = null,
        gaugeMaxValueElem = null,
        needleElem = null,
        knobElem = null,
        pinElem = null,
        labelElem = null,
        trackElements = null,

        instance = null;

    if (startAngle < endAngle) {
        console.log("WARN! startAngle < endAngle, Swapping");
        var tmp = startAngle;
        startAngle = endAngle;
        endAngle = tmp;
    }

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

    // EXPERIMENTAL!!
    /**
     * Simplistic animation function for animating the gauge. That's all!
     * Options are:
     * {
     *  duration: 1,    // In seconds
     *  start: 0,       // The start value
     *  end: 100,       // The end value
     *  step: function, // REQUIRED! The step function that will be passed the value and does something
     *  easing: function // The easing function. Default is easeInOutCubic
     * }
     */
    function Animation(options) {
        var duration = options.duration,
            currentIteration = 1,
            iterations = 60 * duration,
            start = options.start || min,
            end = options.end,
            change = end - start,
            step = options.step,
            easing = options.easing || function easeInOutCubic(progr) {
                // https://github.com/danro/easing-js/blob/master/easing.js
                if ((progr /= 0.5) < 1) {
                    return 0.5 * Math.pow(progr, 3);
                } else {
                    return 0.5 * (Math.pow((progr - 2), 3) + 2);
                }
            };

        //console.log('start ', start, 'end ', end);

        function animate() {
            var progress = currentIteration / iterations,
                value = (change * easing(progress)) + start;

            // console.log(progress + ", " + value);
            step(value);
            currentIteration += 1;

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                step(end);
            }
        }
        // start!
        requestAnimationFrame(animate);
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

    /**
     * Translates percentage value to angle. e.g. If gauge span angle is 180deg, then 50%
     * will be 90deg
     */
    function getAngle(percentage, gaugeSpanAngle) {
        return percentage * gaugeSpanAngle / 100;
    }

    function normalize(val, min, max) {
        var val = Number(val);
        if (val > max) return max;
        if (val < min) return min;
        return val;
    }

    function getValueInPercentage(val, min, max) {
        var normval = normalize(val, min, max);
        var newMax = max - min, newVal = normval - min;
        return 100 * newVal / newMax;
    }

    /**
     * Gets cartesian co-ordinates for a specified radius and angle (in degrees)
     * @param cx {Number} The center x co-oriinate
     * @param cy {Number} The center y co-ordinate
     * @param radius {Number} The radius of the circle
     * @param angle {Number} The angle in degrees
     * @return An object with x,y co-ordinates
     */
    function getCartesian(cx, cy, radius, angle) {
        var rad = angle * Math.PI / 180;
        return {
            x: Math.round((cx + radius * Math.cos(rad)) * 1000) / 1000,
            y: Math.round((cy + radius * Math.sin(rad)) * 1000) / 1000
        };
    }

    // Returns start and end points for dial
    // i.e. starts at 135deg ends at 45deg with large arc flag
    // REMEMBER!! angle=0 starts on X axis and then increases clockwise
    function getDialCoords(radius, startAngle, endAngle) {
        var cx = centerX,
            cy = centerY;
        return {
            end: getCartesian(cx, cy, radius, endAngle),
            start: getCartesian(cx, cy, radius, startAngle)
        };
    }


    function pathString(radius, startAngle, endAngle, largeArc) {
        var coords = getDialCoords(radius, startAngle, endAngle),
            start = coords.start,
            end = coords.end,
            largeArcFlag = typeof (largeArc) === "undefined" ? 1 : largeArc;

        return [
            "M", start.x, start.y,
            "A", radius, radius, 0, largeArcFlag, 1, end.x, end.y
        ].join(" ");
    }

    function createArcElement(strokeColor, width, pathStr, classStr, fillColor, lineCap) {
        return svg("path", {
            "class": classStr,
            fill: fillColor || 'none',
            stroke: strokeColor,
            "stroke-linecap": lineCap || 'butt',
            "stroke-width": width,
            d: pathStr // value of 0
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

    function createPolygonElement(points, strokeColor, width, classStr, fillColor) {
        return svg("polygon", {
            "class": classStr,
            points: points,
            fill: fillColor || 'none',
            stroke: strokeColor,
            "stroke-width": width
        });
    }

    function createTxtElement(coX, coY, fontColor, fontSize, fontWeight, classStr) {
        return svg("text", {
            "class": classStr,
            x: coX,
            y: coY,
            fill: fontColor,
            "font-size": fontSize,
            "font-family": "sans-serif",
            "font-weight": fontWeight,
            "text-anchor": "middle",
            "dominant-baseline": "central"
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

    function getPolygonPoints(cx, cy, rad, pointConf, angle) {
        var leftPoints = [];
        var rightPoints = [];
        var points = null;
        for (var i = 0; i < pointConf.length; i++) {
            var conf = pointConf[i];
            var cp = getCartesian(cx, cy, rad * conf.radiusFactor, angle);
            var left = getCartesian(cp.x, cp.y, conf.width / 2, angle - 90);
            var right = getCartesian(cp.x, cp.y, conf.width / 2, angle + 90);
            leftPoints[i] = left;
            rightPoints[i] = right;
        }
        // console.log(' Here in Poypoints');

        points = leftPoints.concat(rightPoints.reverse());
        // console.log(points);
        return points;
    }
    function getTangetPointsFromPoint(point, cx, cy, rad) {
        var dx = cx - point.x;
        var dy = cy - point.y;
        var dist = Math.sqrt(dx * dx + dy * dy);

        if (dist <= rad) {
            return null;   // no valid tangents
        }

        /* Determine the distance from point to center where line connecting tangent point cuts radius */
        var a = (rad * rad) / (2.0 * dist);
        var rcx = cx + (dx * a / dist);
        var rcy = cy + (dy * a / dist);
        /* Determine the distance to either of the tangent points from rcx.
        */
        var h = Math.sqrt((rad * rad) - (a * a));
        /* Now determine the offsets of the intersection points from
      * point rcx.
      */
        var rx = -dy * (h / dist);
        var ry = dx * (h / dist);

        return [{ x: rcx + rx, y: rcy + ry }, { x: rcx - rx, y: rcy - ry }];
    }

    function createNeedleElement() {
        var //p1 = { x: centerX, y: centerY },
            p1 = getCartesian(centerX, centerY, radius * needleStartFactor, startAngle),
            p2 = getCartesian(centerX, centerY, radius * needleEndFactor, startAngle),
            elem = null;
        if (needleType === 'triangle') {
            //p2 is point on circumference        
            var tp1 = p2;
            //calculate another points considering p1 as center and endpoints of diameter of the cicle perpendicular to line p1-p2     
            // with radius=needleBaseWidth/2
            var tp2 = getCartesian(p1.x, p1.y, needleBaseWidth / 2, startAngle - 90);
            var tp3 = getCartesian(p1.x, p1.y, needleBaseWidth / 2, startAngle + 90);
            var pointsStr = getPointsString([tp1, tp2, tp3]);

            elem = createPolygonElement(pointsStr, needleStrokeColor, needleStrokeWidth, needleClass, needleColor);
        } else if (needleType === 'polygon') {
            var points = getPolygonPoints(centerX, centerY, radius, needlePointsConf, startAngle);
            var pointsStr = getPointsString(points);

            elem = createPolygonElement(pointsStr, needleStrokeColor, needleStrokeWidth, needleClass, needleColor);
        } else if (needleType === 'widepointer') {
            var tp = getTangetPointsFromPoint(p2, centerX, centerY, knobRadius);
            if (tp === null) {
                return null;
            }
            var points = tp.concat([p2]);
            var pointsStr = getPointsString(points);
            elem = createPolygonElement(pointsStr, needleStrokeColor, needleStrokeWidth, needleClass, needleColor);
        } else {
            elem = createLineElement(p1, p2, needleStrokeWidth, needleColor, needleClass, needleLineCap);
        }

        return elem;
    }

    function createTrackElement() {

        var trElem = null;
        var elems = [];
        var labelElems = [];
        var startA = startAngle;

        var prePerc = 0;
        var i = 0;
        for (i = 0; i < trackConf.length; i++) {
            var valPerc = getValueInPercentage(trackConf[i].threshold, min, max);
            var angle = getAngle(valPerc - prePerc, 360 - Math.abs(startAngle - endAngle));
            var flag = angle <= 180 ? 0 : 1;

            var pathStr = pathString(radius, startA, startA + angle, flag);

            elems[i] = createArcElement(trackConf[i].color,
                thresholdStrokeWidth, pathStr, dialClass, 'none', trackLineCap);

            if (showThresholdLables) {

                var co = getCartesian(centerX,
                    centerY,
                    radius * thresholdLablesRadiusFactor,
                    startA + angle
                );
                labelElems[i] = createTxtElement(co.x, co.y,
                    thresholdLabelColor, thresholdLabelSize, thresholdLabelWeight, trackLabelClass);
                labelElems[i].textContent = trackConf[i].threshold;
            }
            startA = startA + angle;
            prePerc = valPerc;
        }
        if (showThresholdLables) {
            var co = getCartesian(centerX,
                centerY,
                radius * thresholdLablesRadiusFactor,
                startAngle
            );
            labelElems[i] = createTxtElement(co.x, co.y,
                thresholdLabelColor, thresholdLabelSize, thresholdLabelWeight, trackLabelClass);
            labelElems[i].textContent = min;
        }
        trackElements = elems;
        elems = elems.concat(labelElems);
        trElem = svg("g", {}, elems);
        return trElem;
    }

    function highlightTrackSegment(val) {
        var pointedSegIndex = 0;
        var segFound = false;
        for (var i = 0; i < trackConf.length; i++) {
            trackElements[i].style.stroke = trackConf[i].color;
            if (val <= trackConf[i].threshold && segFound == false) {
                if (!segFound) {
                    pointedSegIndex = i;
                    segFound = true;
                }
            }
        }
        trackElements[pointedSegIndex].style.stroke = trackConf[pointedSegIndex].highlightColor;
    }

    function updateNeedleElement(angle) {
        if (needleElem === null) {
            return;
        }
        var relAngle = angle + startAngle;
        var p1 = getCartesian(centerX, centerY, radius * needleStartFactor, relAngle);
        var p2 = getCartesian(centerX, centerY, radius * needleEndFactor, relAngle);

        if (needleType === 'triangle') {
            var tp1 = p2;
            //calculate another points considering p1 as center and endpoints of diameter of the cicle perpendicular to line p1-p2     
            // with radius=needleBaseWidth/2
            var tp2 = getCartesian(p1.x, p1.y, needleBaseWidth / 2, relAngle - 90);
            var tp3 = getCartesian(p1.x, p1.y, needleBaseWidth / 2, relAngle + 90);
            pointsStr = getPointsString([tp1, tp2, tp3]);
            needleElem.setAttribute('points', pointsStr);

        } else if (needleType === 'polygon') {
            var points = getPolygonPoints(centerX, centerY, radius, needlePointsConf, relAngle);
            var pointsStr = getPointsString(points);
            needleElem.setAttribute('points', pointsStr);
        } else if (needleType === 'widepointer') {
            var tp = getTangetPointsFromPoint(p2, centerX, centerY, knobRadius);
            if (tp === null) {
                return;
            }
            var points = tp.concat([p2]);
            var pointsStr = getPointsString(points);

            needleElem.setAttribute('points', pointsStr);
        }
        else {//default type consired as line
            needleElem.setAttribute('x1', p1.x);
            needleElem.setAttribute('y1', p1.y);
            needleElem.setAttribute('x2', p2.x);
            needleElem.setAttribute('y2', p2.y);
        }
    }
    function updateValueElement(val, angle) {
        gaugeValueElem.textContent = displayValFunc.call(opts, val);
        if (valueMoveWithGauge) {
            var relAngle = angle + startAngle + valueOffsetAngle;
            var newPos = getCartesian(centerX, centerY, radius * valueRadiusFactor, relAngle);
            gaugeValueElem.setAttribute('x', newPos.x);
            gaugeValueElem.setAttribute('y', newPos.y);
        }
    }

    function initializeGauge(elem) {
        if (showValue) {
            gaugeValueElem = createTxtElement(centerX + valPosOffsetX,
                centerY + valPosOffsetY, valueColor,
                valueFontSize, valueFontWeight, valueTextClass);
        }
        if (showMinMax) {
            //calculate for Min value
            var coMin = getCartesian(centerX,
                centerY,
                radius * minMaxRadiusFactor,
                startAngle - minMaxOffsetAngle
            );
            gaugeMinValueElem = createTxtElement(coMin.x, coMin.y,
                minMaxColor, minMaxFontSize, minMaxFontWeight, minMaxTextClass);

            gaugeMinValueElem.textContent = min;
            //Calculate for Max value
            var coMax = getCartesian(centerX,
                centerY,
                radius * minMaxRadiusFactor,
                endAngle + minMaxOffsetAngle
            );
            gaugeMaxValueElem = createTxtElement(coMax.x, coMax.y,
                minMaxColor, minMaxFontSize, minMaxFontWeight, minMaxTextClass);
            gaugeMaxValueElem.textContent = max;
        }
        if (showNeedle) {
            needleElem = createNeedleElement();
        }
        if (showKnob) {
            var knobPathStr = pathString(knobRadius, knobStartAngle, knobEndAngle);
            knobElem = createArcElement(knobStrokeColor, knobStrokeWidth, knobPathStr, knobClass, knobColor);
        }
        if (showPin) {
            pinElem = createCircleElement(centerX, centerY, pinRadius, pinStrokeColor, pinStrokeWidth, pinClass, pinColor);
        }
        if (label !== null) {
            labelElem = createTxtElement(centerX + labelOffsetX,
                centerY + labelOffsetY, lableColor,
                labelFontSize, labelFontWeight, labelClass);
            labelElem.textContent = label;
        }

        gaugeTrackPath = createTrackElement();

        var gaugeChilds = [gaugeTrackPath,
            needleElem,
            knobElem,
            pinElem,
            gaugeValueElem,
            gaugeMinValueElem,
            gaugeMaxValueElem,
            labelElem
        ];
        if (needleOnTopofKnob) {
            gaugeChilds = [gaugeTrackPath,
                knobElem,
                needleElem,
                pinElem,
                gaugeValueElem,
                gaugeMinValueElem,
                gaugeMaxValueElem,
                labelElem
            ];
        }

        var gaugeElement = svg("svg",
            { "viewBox": viewBox, "class": gaugeClass }, gaugeChilds);
        elem.appendChild(gaugeElement);
    }

    function updateGauge(theValue) {
        var val = getValueInPercentage(theValue, min, max),
            angle = getAngle(val, 360 - Math.abs(startAngle - endAngle)),
            // this is because we are using arc greater than 180deg
            flag = angle <= 180 ? 0 : 1;
        if (showValue) {
            updateValueElement(theValue, angle);
        }
        if (showNeedle) {
            updateNeedleElement(angle);
        }
        if (highlightTrackSeg) {
            highlightTrackSegment(theValue);
        }
    }

    instance = {
        setValue: function (val) {
            value = val;
            updateGauge(value);
        },
        setValueAnimated: function (val, duration) {
            if (val === value) {
                return;
            }
            var oldVal = value;
            value = val;

            Animation({
                start: oldVal || min,
                end: value,
                duration: duration || 1,
                step: function (val) {
                    updateGauge(val);
                }
            });
        },
        setValueColor: function (color) {
            gaugeValueElem.setAttribute('fill', color);
        },
        setMinMaxColor: function (color) {
            gaugeMinValueElem.setAttribute('fill', color);
            gaugeMaxValueElem.setAttribute('fill', color);
        },
        getValue: function () {
            return value;
        },
        getOpts: function () {
            return opts;
        }

    };

    initializeGauge(element);

    return instance;
}