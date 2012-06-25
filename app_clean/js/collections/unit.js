/**
 * UnitCollection object
 *
 * Collections are ordered sets of models. This is the collection set of UnitModels
 *
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/unit'
], function ($, _, Backbone, UnitModel) {

    var UnitCollection = Backbone.Collection.extend({

        model:UnitModel,

        url:'api/units'
    });

    return UnitCollection;
});