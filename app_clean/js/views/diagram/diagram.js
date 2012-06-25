// Use this as a quick template for future modules
define([
    'jquery',
    'underscore',
    'backbone',
    'engine',
    'constants',
    'order!d3',
    'order!d3Layout',
    'jqueryUIDraggable'
], function ($, _, Backbone, Engine, Constants) {

    var TOP = 0;
    var LEFT = 1;
    var BOTTOM = 2;
    var RIGHT = 3;

    var DiagramView = Backbone.View.extend({
        id:'canvas',
        tagName:'div',

        initialize:function (options) {
            this.width = options.width || 1200;
            this.height = options.height || 600;
            this.padding = options.padding || [40, 120, 40, 120];

            this.$panel = $(options.panel);


        },
        render:function () {

            this.$panel.append(this.el);

            /* now that we have the element append the svg */
            this.vis = d3.select('#'+this.el.id).append("svg:svg")
                .attr('width', this.width + this.padding[LEFT] + this.padding[RIGHT])
                .attr('height', this.height + this.padding[TOP]+ this.padding[BOTTOM])
                .append("svg:g")
                .attr("transform", "translate(" +this.padding[BOTTOM] + "," + this.padding[TOP] + ")");

            /* now render diagram using global collection attached to Engine */
            this.renderHorizontalDiagram.apply(this);

            this.$('circle').draggable({
                helper:function () {
                    var $draggedNode = $('<div/>').css({
                        'z-index':9999,
                        'background-color':'#000',
                        'width':'80px',
                        'height':'80px',
                        'padding':'2px'
                    }).attr('id', 'draggable_node').addClass('node');


                    $('body').append($draggedNode);


                    return $draggedNode;


                },
                opacity:'0.7'
            });

        },
        renderHorizontalDiagram:function () {
            d3.selectAll('g.node').remove();
            /* initialize tree + diagonal generator */
            this.tree = d3.layout.tree()
                .size([this.height, this.width])
                .separation(function (a, b) {
                    return a.parent == b.parent ? 20 : 40;
                })
                .children(function(d){
                    return d.related();
                });


            this.diagonal = d3.svg.diagonal()
                .projection(function(d){

                    return [d.y, d.x];}
            );

            this.rootNode = Engine.collection.find(function (node) {
                return parseInt(node.get('type')) === Constants.NODE_TYPES.ROOT;
            });

            if (typeof this.rootNode === 'undefined') {
                this.goTo('error/407');
                return false;
            }

            this.rootNode.x0 = this.width / 2;
            this.rootNode.y0 = 0;
            /* have reference to root element */
            /* root is already an array so pass it as only argument */
            this.draw.apply(this, [this.rootNode])
        },
        draw:function (source) {
            var that = this;
            var duration = d3.event && d3.event.altKey ? 5000 : 500;

            // Compute the new tree layout.
            var nodes = this.tree.nodes(this.rootNode).reverse();

            // Normalize for fixed-depth.
            nodes.forEach(function (d) {
                d.y = d.depth * 180;
            });

            // Update the nodes…
            var node = this.vis.selectAll("g.node")
                .data(nodes, function (d) {
                    return d.id || (d.id = ++i);
                });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("svg:g")
                .attr("class", "node")
                .attr("transform", function (d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on("dblclick", function (d) {
                    that.toggleNode(d);
                    that.draw.apply(that, [d]);
                })
                .on("click", function (d){
                    d3.selectAll('circle')
                        .attr('r', 4.5)
                        .style('stroke-width','1.5px');

                    d3.select(this)
                        .select('circle')
                        .attr('r', 10)
                        .style('stroke-width','2px');

                    Engine.selected = d;
                });

            nodeEnter.append("svg:circle")
                .attr("r", 1e-6)
                .style("fill", function (d) {
                    return d.get('collapsed') ? "lightsteelblue" : "#fff";
                });

            nodeEnter.append("svg:text")
                .attr("x", function (d) {
                    return d.related() ? -10 : 10;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", function (d) {
                    return d.related() ? "end" : "start";
                })
                .text(function (d) {
                    return d.get('title');
                })
                .style("fill-opacity", 1e-6);

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            nodeUpdate.select("circle")
                .attr("r", function(d){
                    return Engine.selected && Engine.selected.id === d.id? 10 : 4.5
                })
                .style("fill", function (d) {
                    return d.get('collapsed') ? "lightsteelblue" : "#fff";
                });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function (d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…

            var link = this.vis.selectAll("path.link")
                .data(this.tree.links(nodes), function (d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("svg:path", "g")
                .attr("class", "link")
                .attr("d", function (d) {
                    var o = {x:source.x0, y:source.y0};
                    return that.diagonal({source:o, target:o});
                })
                .transition()
                .duration(duration)
                .attr("d", that.diagonal);

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", that.diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function (d) {
                    var o = {x:source.x, y:source.y};
                    return that.diagonal({source:o, target:o});
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function (d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });

        },
        toggleNode: function(node)
        {
            if (node.get('collapsed')) {
                node.set('collapsed',false);
            } else {
                node.children = null;
                node.set('collapsed',true);
            }
        },
        clean: function()
        {
            Engine.selected = null;
        }
    });

    return DiagramView;
});
