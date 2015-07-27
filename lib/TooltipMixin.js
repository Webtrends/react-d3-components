"use strict";

var React = require("react");
var d3 = require("d3");
var Constants = require("./Constants");

var TooltipMixin = {
    propTypes: {
        tooltipHtml: React.PropTypes.func
    },

    getInitialState: function getInitialState() {
        return {
            tooltip: {
                hidden: true
            }
        };
    },

    getDefaultProps: function getDefaultProps() {
        return {
            tooltipOffset: { top: -20, left: 15 },
            tooltipHtml: null
        };
    },

    componentDidMount: function componentDidMount() {
        this._svg_node = React.findDOMNode(this).getElementsByTagName("svg")[0];
    },

    onMouseEnter: function onMouseEnter(e, data) {
        if (!this.props.tooltipHtml) {
            return;
        }

        e.preventDefault();

        var _props = this.props;
        var margin = _props.margin;
        var tooltipHtml = _props.tooltipHtml;

        var svg = this._svg_node;
        var position = undefined;

        var windowWidth = Math.min(window.innerWidth, document.body.clientWidth);
        var tooltipWidth = Constants.TOOLTIP_WIDTH[this.props.tooltipWidth.toUpperCase()];

        // If tooltip is wider than the space between the cursor and the end of the svg, flip to other side of cursor
        var positioningOffset = e.clientX + tooltipWidth > windowWidth ? -(tooltipWidth + this.props.tooltipOffset.left) : this.props.tooltipOffset.left;

        if (svg.createSVGPoint) {
            var point = svg.createSVGPoint();
            point.x = e.clientX, point.y = e.clientY;
            point = point.matrixTransform(svg.getScreenCTM().inverse());
            position = [point.x - margin.left, point.y - margin.top];
        } else {
            var rect = svg.getBoundingClientRect();
            position = [e.clientX - rect.left - svg.clientLeft - margin.left, e.clientY - rect.top - svg.clientTop - margin.top];
        }

        this.setState({
            tooltip: {
                top: e.clientY + this.props.tooltipOffset.top,
                left: e.clientX + positioningOffset,
                hidden: false,
                html: this._tooltipHtml(data, position)
            }
        });
    },

    onMouseLeave: function onMouseLeave(e) {
        if (!this.props.tooltipHtml) {
            return;
        }

        e.preventDefault();

        this.setState({
            tooltip: {
                hidden: true
            }
        });
    }
};

module.exports = TooltipMixin;