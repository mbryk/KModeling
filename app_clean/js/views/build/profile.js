define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/build/profile.html',
], function ($, _, Backbone, BuildProfileTemplate) {

    var BuildPage = Backbone.View.extend({
        el:'.page',

        events:{
            'click #start-build':'start',
            'click #next':'nextScreen',
            'click #previous':'previousScreen',
            'click #cancel':'cancel'
        },

        nextScreen:function (e) {
            e.preventDefault();
            alert("heyo");
            //save whatever is on this screen
        },
        previousScreen: function(e)
        {
            e.preventDefault();
            alert("heyo prev");
        },
        cancel: function(e)
        {
            
        },
        start: function(e)
        {
            e.preventDefault();
            alert("heyo start!");

            var that = this;
            /* dashboard holds logged user, and logged user should have its id */
            /* lets put bogus one for now */
            require(['models/build', 'views/build/1', 'constants'],
                function (MindmapModel, NewMindmapView, Constants) {

                    /* unit collection for TIME units required only */
                    var unitCollection = Constants.UNITS.where({unitType:Constants.UNIT_TYPES.TIME});

                    var mindmapModel = new MindmapModel();

                    mindmapModel.on('new:mindmap:create', that.createMindmap);

                    that.newMindmapView = new NewMindmapView({header:'Create New Mindmap', model:mindmapModel, units:unitCollection});

                    that.newMindmapView.render().$el.modal();
                    return false;
                });


        },
        
        render:function () {
            this.$el.html(BuildProfileTemplate);
        }
    });
    return BuildPage;
});