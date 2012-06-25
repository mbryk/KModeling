/**
 * MindMapModel model
 *
 * Attributes:
 *      id, user_id, name, timeframeUnitsId, timeframeLength, timeResolutionUnitsId
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    var BuildModel = Backbone.Model.extend({

        defaults:{
            account_id:0, // attributes are better to be capitalized than underscored
            company_name:'',
            industry:'Coal',
            website:''
        },

        /**
         * url changes when it has id so to clarify create/update calls
         */
        url:function () {
            return !this.isNew() ? 'api/build/' + this.id : 'api/build';
        },

        /**
         * validation object
         * @see backbone.validation.js
         */
        validation: {
            company_name: {
                required: true,
                msg: 'Name is required'
            },
        }
    });

    return BuildModel;
});
