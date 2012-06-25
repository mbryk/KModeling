/**
 *
 * NavbarView object
 *
 * Renders navigation bar
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/header/menu.html',
    'bootstrapDropdown'
], function($, _, Backbone, dropdownTemplate) {

    var HeaderMenuView = Backbone.View.extend({

        /**
         * Setup element's selector
         */
        el: ".menu",

        /**
         * Initialize template
         */
        dropdownTemplate : _.template(dropdownTemplate),

        /**
         * Setup events
         */
        events: {
            'click #nav-logout'		: 'logout'

        },

        /**
         * Backbone's iniitalize method
         */
        initialize: function(options) {
            _.bindAll(this, 'render', 'logout', 'clean');

            this.appView = options.appView;
        },

        /**
         * Starts logout process
         * @see Logout of login.js
         */
        logout: function(e) {

            e.preventDefault();

            Backbone.Events.trigger('site:logout');

        },

        /**
         * Renders navigation toolbar
         */
        render: function() {
            this.$el.html(this.dropdownTemplate());
            return this;
        },

        /**
         * Clears references and removes elements
         */
        clean: function() {
            this.$el.html('');
        }

    });

    return HeaderMenuView;
});
