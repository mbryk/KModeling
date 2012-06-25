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

            var that = this;
            /* dashboard holds logged user, and logged user should have its id */
            /* lets put bogus one for now */
            require(['models/build', 'views/build/first1'],
                function (BuildModel, NewFirstView) {

                    var buildModel = new BuildModel();

                    that.newFirstView = new NewFirstView({header:'Start Build', model:buildModel});

                    that.newFirstView.render().$el.modal();
                    return false;
                });
        },
        
        render:function () {
            this.$el.html(BuildProfileTemplate);
        }
    });
    return BuildPage;
});