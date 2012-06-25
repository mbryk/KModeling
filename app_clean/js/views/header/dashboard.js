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
    'text!templates/header/dashboard.html',
    'bootstrapDropdown'
], function ($, _, Backbone, DropdownTemplate) {

    var DashboardHeaderMenuView = Backbone.View.extend({

        /**
         * Setup element's selector
         */
        el:".menu",

        /**
         * Initialize template
         */
        dropdownTemplate:_.template(DropdownTemplate),

        /**
         * Setup events
         */
        events:{
            'click #nav-new':'newMindmap',
            'click #nav-duplicate':'duplicateMindmap',
            'click #nav-delete':'deleteMindmap',
            'click #nav-logout':'logout'

        },

        /**
         * Backbone's initialize method
         */
        initialize:function (options) {
            _.bindAll(this, 'render', 'logout', 'clean');

            this.appView = options.appView;

        },

        newMindmap:function (e) {
            e.preventDefault();

            var that = this;
            /* dashboard holds logged user, and logged user should have its id */
            /* lets put bogus one for now */
            require(['models/mindmap', 'views/mindmap/new', 'constants'],
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

        createMindmap:function () {
            /* validation should occur before, we can safe the project */
            Backbone.Events.trigger('mindmap:create', this);
        },

        duplicateMindmap:function (e) {
            e.preventDefault();
            Backbone.Events.trigger('mindmap:duplicate');
        },

        deleteMindmap:function (e) {
            e.preventDefault();
            /* calling custom event to remove from appropriate view */
            /* see thumbnails.js */
            Backbone.Events.trigger('mindmap:delete');
        },
        /**
         * Starts logout process
         * @see Logout of login.js
         */
        logout:function (e) {

            e.preventDefault();

            Backbone.Events.trigger('site:logout');

        },

        /**
         * Renders navigation toolbar and thumbnails
         */
        render:function () {
            this.$el.html(this.dropdownTemplate());

            return this;
        },

        /**
         * Clears references and removes elements
         */
        clean:function () {
            Backbone.Events.off('app:logout');

            this.$el.html('');
        }

    });

    return DashboardHeaderMenuView;
});