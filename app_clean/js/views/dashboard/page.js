define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/dashboard/page.html'
], function ($, _, Backbone, DashboardPageTemplate) {

    var DashboardPage = Backbone.View.extend({
        el:'.page',

        render:function () {
            var that = this;

            that.$el.html(DashboardPageTemplate);

            require(['collections/mindmap', 'views/mindmap/thumbnails'], function (MindmapCollection, ThumbnailsView) {
                var mindmapCollection = new MindmapCollection();
                $.when(mindmapCollection.fetch()).then(function () {

                    that.thumbnailsView = new ThumbnailsView({collection:mindmapCollection});
                    that.$el.append(that.thumbnailsView.render().el);
                });
            });
        },

        clean:function () {
	    	this.thumbnailsView.clean();

        }
    });
    return DashboardPage;
});