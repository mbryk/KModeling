/**
 * NodeCollection object
 *
 * Collections are ordered sets of models. This is the collection set of ModuleModels
 *
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'models/node'
], function ($, _, Backbone, NodeModel) {

    var NodeCollection = Backbone.Collection.extend({

        model:NodeModel,

        initialize: function(options){
            this.mindmap_id = options.mindmap_id;
        },

        url:function () {

            /* if we have set its mindmap_id then modify its url */
            return typeof this.mindmap_id != 'undefined' ? 'api/nodes/' + this.mindmap_id : 'api/nodes';
        }
    });

    return NodeCollection;
});