/**
 * UnitModel object
 *
 * Model containing the interactive data as well as a large part of the logic
 * surrounding it: conversions, validations, computed properties,
 * and access control of Modules.
 *
 * Here is where we need to setup logic with database
 *
 * Attributes:
 *     id, unitType, coefficient, title
 *
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var UnitModel = Backbone.Model.extend({

        /**
         * url to save the model
         */
        urlRoot:'api/unit',

        /**
         * url changes when it has id so to clarify create/update calls
         */
        url:function () {
            return !this.isNew() ? 'api/unit/' + this.id : 'api/unit';
        }
    });

    return UnitModel;
});