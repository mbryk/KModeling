define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/mindmap/thumbnail.html'
], function ($, _, Backbone, thumbnailViewTemplate) {

    var ThumbnailView = Backbone.View.extend({

        tagName:'li',
        className:'span3',

        template:_.template(thumbnailViewTemplate),

        initialize: function() {
            _.bindAll(this, 'clean');

            this.model.on('destroy', this.clean);
        },

        events:{
            'click .thumbnail':'select',
            'dblclick .thumbnail':'open'
        },

        select:function () {
            this.$el.parent().find('.thumbnail').removeClass('selected');
            this.$('.thumbnail').addClass('selected');
        },

        open:function () {
            /* TODO: open mindmap for edition. Not yet implemented */
            /* should we render here? */
            this.goTo('mindmap/'+this.model.id);
        },

        render:function () {

            $(this.el).html(this.template({id:this.model.get('id'),name:this.model.get('name')}));

            return this;
        },

        clean:function () {
            this.model.off();
            this.undelegateEvents();
            this.remove();
        }
    });
    return ThumbnailView;
});