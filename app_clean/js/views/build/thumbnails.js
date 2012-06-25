define([
    'jquery',
    'underscore',
    'backbone',
    'notifier',
    'text!templates/mindmap/thumbnails.html'
], function ($, _, Backbone, Notifier, ThumbnailsViewTemplate) {

    var ThumbnailsView = Backbone.View.extend({

        template:_.template(ThumbnailsViewTemplate),

        initialize:function () {
            _.bindAll(this, 'createMindmap', 'deleteMindmap', 'duplicateMindmap', 'addOne', 'addAll');

            this.collection.on('add', this.addOne);
            this.collection.on('sync', function(){ Notifier.notify('Mindmap successfully created', Notifier.SUCCESS);})

            Backbone.Events.on('mindmap:create', this.createMindmap);
            Backbone.Events.on('mindmap:delete', this.deleteMindmap);
            Backbone.Events.on('mindmap:duplicate', this.duplicateMindmap);
        },

        render:function () {

            $(this.el).html(this.template());
            this.addAll();
            return this;
        },

        createMindmap:function (model) {

            this.collection.create(model,{wait:true});
        },

        deleteMindmap:function () {
            /* selected thumbnail view has its data-id */
            var id = this.getSelectedId.call(this);

            if (_.isNull(id)) {
                return Notifier.alertDialog('Info', 'Please, select a project to delete.');
            }

            var that = this;

            Notifier.confirmDialog(
                'Delete Mindmap?', 'Are you sure to delete completely selected Mindmap?', 'delete',
                function () {
                    /* on removing, it will delete the model */
                    that.collection.remove(that.collection.get(id));
                    if(!that.collection.length)
                    {
                        that.$('.thumbnails').hide();
                    }
                }
            );
        },

        duplicateMindmap:function(){
            /* we are going to duplicate selected view */
            var id = this.getSelectedId.call(this);

            if(_.isNull(id))
            {
                return Notifier.alertDialog('Info', 'Please, select a project to duplicate.');
            }

            var that = this;
            Notifier.confirmDialog(
                'Duplicate Mindmap', 'Duplicate selected Mindmap?', 'duplicate',
                function () {
                    /* on removing, it will delete the model */

                    var mindmap = that.collection.get(id).toJSON();
                    var name = mindmap.name;

                    mindmap.id = null;

                    mindmap.name =  name+that.$('.thumbnail>.caption>h5:contains('+name+')').length;
                    that.collection.create(mindmap, {
                        wait: true,
                        success:function() {
                            Notifier.notify('Mindmap successfully created', Notifier.SUCCESS);
                        }
                    });
                }
            );
        },

        addOne:function (model) {
            var that = this;

            require(['views/mindmap/thumbnail'], function (ThumbnailView) {

                var view = new ThumbnailView({model:model});
                that.$('.thumbnails').append(view.render().el);

                model.on('remove', function () {
                    /* destroying will call the clean event on thumbnail.js */
                    this.destroy({success:
                        function(model,resp){
                            Notifier.notify('Mindmap successfully deleted', Notifier.SUCCESS);
                        }
                    });
                });

                if(!that.$('.thumbnails').is(':visible'))
                {
                    that.$('.thumbnails').show();
                }
            });
        },

        addAll:function () {
            this.collection.each(this.addOne);
        },

        clean:function () {
            this.collection.off();
            Backbone.Events.off('mindmap:create mindmap:delete mindmap:duplicate');
        },

        getSelectedId: function () {
            var thumb = this.$('.selected');
            return thumb.length && thumb.data('id') ? thumb.data('id') : null;
        }
    });
    return ThumbnailsView;
});