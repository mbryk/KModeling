/**
 * BuildCollection object
 *
 * Collections are ordered sets of models. This is the collection set of MindMapModels
 *
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/build'
], function ($, _, Backbone, BuildModel) {

    var BuildCollection = Backbone.Collection.extend({
        model:BuildModel,

        url:'api/build'
    });

    return BuildCollection;
});
