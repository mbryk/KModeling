define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/build/profile.html',
], function ($, _, Backbone, BuildProfileTemplate) {

    var BuildPage = Backbone.View.extend({
        el:'.page',
        
        initialize:function () {
            require(['collections/build'],
                function (BuildCollection) {                    
                    var buildCollection = new BuildCollection();
                    this.collection = buildCollection;
                    return false;
                });
        },

        events:{
            'click #start-build':'start',
        },

        start: function(e)
        {
            e.preventDefault();

            var that = this;
            /* dashboard holds logged user, and logged user should have its id */
            /* lets put bogus one for now */
            require(['views/build/first1','models/build'],
                function (NewFirstView, BuildModel) {
                    var buildModel = new BuildModel();
                    buildModel.on('new:build:submit1', this.buildFirst);
                    buildModel.on('new:build:submit2', this.buildSecond);
                    buildModel.on('new:build:submit3', this.buildThird);
                    buildModel.on('new:build:submit4', this.buildFourth);
                    
                    that.newFirstView = new NewFirstView({header:'Start Build', model: buildModel});

                    that.newFirstView.render().$el.modal();
                    return false;
                });
        },
        
        buildFirst: function()
        {
            //this.collection.create(model);
        },
        
        render:function () {
            this.$el.html(BuildProfileTemplate);
        }
    });
    return BuildPage;
});