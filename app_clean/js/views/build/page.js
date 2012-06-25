define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/mindmap/page.html',
    'views/diagram/diagram',
    'engine'
], function ($, _, Backbone, MindmapPageTemplate, DiagramView, Engine) {

    var MindmapPage = Backbone.View.extend({
        el:'.page',

        events:{
            'click #add-node':'addNode',
            'click #del-node':'deleteNode'
        },

        initialize:function (options) {

            var that = this;

            that.mindmapId = options.mindmapId;
            /* initialize the main collection of nodes first */
            Engine.initialize(that.mindmapId).done(function () {
                /* now we can easily render the mindmap graph */
                require(['views/diagram/diagram'], function (DiagramView) {
                    that.diagram = new DiagramView({panel:'#mindmap'});
                    that.diagram.render();

                    Backbone.Events.trigger('render:header:menu');
                });
            });
        },
        addNode:function (e) {
            e.preventDefault();

            var that = this;

            require(['notifier', 'constants'], function (Notifier, Constants)
            {
                if (!Engine.selected) {
                    Notifier.notify('Please, select a node to add a child', Notifier.ERROR);
                    return false;
                }

                Notifier.notify('Remember, this is for testing purposes only', Notifier.WARNING);

                Engine.collection.create({
                    parent_id:Engine.selected.id,
                    title:'Untitled',
                    type:Constants.NODE_TYPES.SUM,
                    mindmap_id:that.mindmapId
                }, {
                    wait:true,
                    success:function (model, resp) {
                        Notifier.notify('New model added', Notifier.INFO);
                        that.diagram.draw(that.diagram.rootNode);
                    }
                });
            });


        },
        deleteNode: function(e)
        {
            e.preventDefault();

            var that = this;

            require(['notifier', 'constants'], function (Notifier, Constants)
            {
                if (!Engine.selected) {
                    Notifier.notify('Please, select a node to delete!', Notifier.ERROR);
                    return false;
                }

                Notifier.notify('Remember, this is for testing purposes only', Notifier.WARNING);

                Engine.collection.remove(Engine.selected.id);

                Engine.selected.destroy({
                    wait:true,
                    success:function (model, resp) {
                        Engine.selected = null;
                        Notifier.notify('Model Removed', Notifier.INFO);
                        that.diagram.draw(that.diagram.rootNode);
                    }
                });
            });
        },
        render:function () {

            this.$el.html(MindmapPageTemplate);
        }
    });
    return MindmapPage;
});