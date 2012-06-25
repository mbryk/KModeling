define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/panel/page.html',
    'views/diagram/diagram'
], function ($, _, Backbone, panelPageTemplate, DiagramView) {

    var PanelPage = Backbone.View.extend({
        el:'.page',

        initialize: function(options){
            this.diagram = new DiagramView();
        },
        render:function () {

            $(this.el).html(panelPageTemplate);

            this.diagram.render();
        }
    });
    return PanelPage;
});