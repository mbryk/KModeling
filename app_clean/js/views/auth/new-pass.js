/**
 *
 * ModalNewPassView object
 *
 * Handles the rendering and dynamics of a new password form
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/auth/new-pass.html',
    'bootstrapModal'
], function ($, _, Backbone, modalTemplate) {

    var ModalNewPassView = Backbone.View.extend({
        /**
         * Element's id
         */
        id:'modal',

        /**
         * Init view template
         */
        modalTemplate:_.template(modalTemplate),

        /**
         * setup events
         */
        events:{
            'click .confirm':'confirmAction',
            'click .cancel':'cancelAction'
        },

        /**
         * Backbone's initialization event
         */
        initialize:function (options) {
            _.bindAll(this, 'render');

            this.header = options.header;
        },

        /**
         * Render form
         */
        render:function () {
            this.$el.html(this.modalTemplate({
                header:this.header
            }));

            this.delegateEvents();
            return this;
        },

        /**
         * Confirm button clicked, close dialog and trigger
         * modal:newpass
         * @see login.js resetPassword
         */
        confirmAction:function () {

            $('#modal').modal('hide');
            this.close();
            this.model.trigger('modal:new:pass');
        },

        /**
         * Cancel button clicked, hide dialog and clear resources
         * Triggers global modal:cancel -if set
         */
        cancelAction:function () {

            $('#modal').modal('hide');
            this.close();
            this.model.trigger('modal:cancel');
        },

        /**
         * Clears resources
         */
        close:function () {
            this.undelegateEvents();
            this.remove();
        }

    });

    return ModalNewPassView;
});
