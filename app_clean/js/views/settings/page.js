define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/settings/page.html'
], function($, _, Backbone, settingsPageTemplate){
    var settingsPage = Backbone.View.extend({
        el: '.page',
        render: function () {
            $(this.el).html(settingsPageTemplate);
        }
    });
    return settingsPage;
});
