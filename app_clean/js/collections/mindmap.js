/**
 * MindMapCollection object
 *
 * Collections are ordered sets of models. This is the collection set of MindMapModels
 *
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/mindmap'
], function ($, _, Backbone, MindMapModel) {

    var MindMapCollection = Backbone.Collection.extend({
        model:MindMapModel,

        /* mindmaps own by registered member will be fetched from server */
        url:'api/mindmaps'
    });

    return MindMapCollection;
});
