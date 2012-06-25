define([
    'underscore',
    'collections/node'
], function (_, NodeCollection) {
    return {
        selected:null,
        collection:null,

        initialize:function (id) {
            _.bindAll(this, 'onRemove');

            this.mindmapId = id;
            /* here we initialize all methods related to the collection of nodes */
            /* for example, we could set a method .on('change:attribute') to recalculate values of specific node */
            /* or listen to the .on('add') in order to execute automatic calculations */
            this.collection = new NodeCollection({mindmap_id:id});

            this.collection.on('remove', this.onRemove);

            return this.collection.fetch();
        },

        onRemove:function (model) {
            this.collection.forEach(function (m) {
                if (m.children) {
                    /* this is needed in order to have the tree properly run and calculated again */
                    delete m['children'];
                }
            });
            /* remove orphan children */
            /* they are deleted automatically on the server but on here */
            /* get rid of them silently, we do not want circular referece calls */
            this.collection.remove(this.collection.where({parent_id:model.id}), {silent:true});
        }
    }
});
