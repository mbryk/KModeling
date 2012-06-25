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

    var MindMapModel = Backbone.Model.extend({

        defaults:{
            user_id:0, // attributes are better to be capitalized than underscored
            name:'',
            timeframeUnitsId:1,
            timeframeLength:1,
            timeResolutionUnitsId:1
        },

        /**
         * url changes when it has id so to clarify create/update calls
         */
        url:function () {
            return !this.isNew() ? 'api/mindmap/' + this.id : 'api/mindmap';
        },

        /**
         * validation object
         * @see backbone.validation.js
         */
        validation: {
            name: {
                required: true,
                msg: 'Name is required'
            },
            timeframeLength: {
                pattern: 'digits',
                msg: 'Timeframe Length must be a valid number'
            }
        }
    });

    return MindMapModel;
});
