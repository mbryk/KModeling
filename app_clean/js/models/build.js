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
            company_name:'',
            industry:'Electronics'
        },

        /**
         * url changes when it has id so to clarify create/update calls
         */
        url:function () {
            return !this.isNew() ? 'api/build' + this.account_id : 'api/build';
        },

        /**
         * validation object
         * @see backbone.validation.js
         */
        validation: {
            company_name: {
                required: true,
                msg: 'Company Name is required'
            }
        }
    });

    return BuildModel;
});
