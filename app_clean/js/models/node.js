/**
 * NodeModel object
 *
 * Model containing the interactive data as well as a large part of the logic
 * surrounding it: conversions, validations, computed properties,
 * and access control of Modules.
 *
 * Here is where we need to setup logic with database
 *
 * Attributes:
 *     id, type, mindmap_id, title, description, value, units, parent_id
 *
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var NodeModel = Backbone.Model.extend({

        /**
         * url to save the model
         */
        urlRoot:'api/node',

        default: {
            /**
             * custom attribute specifically created for the diagram view
             */
            collapsed: false
        },
        /**
         * url changes when it has id so to clarify create/update calls
         */
        url:function () {
            return !this.isNew() ? 'api/node/' + this.id : 'api/node';
        },

        related: function() {
            return this.get('collapsed')? null:this.collection.where({parent_id:this.id});
        }
    });

    return NodeModel;
});