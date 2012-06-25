/**
 *
 * ModalInputView object
 *
 * Handles the rendering and dynamics of a forgot pass form
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'text!templates/auth/forgot-pass.html',
    'bootstrapModal'
], function ($, _, Backbone, modalTemplate) {

    var ModalInputView = Backbone.View.extend({
        /**
         * Element's id
         */
        id:"modal",

        /**
         * Init template
         */
        modalTemplate:_.template(modalTemplate),

        /**
         * Setup events
         */
        events:{
            'click .confirm':'confirmAction',
            'click .cancel':'cancelAction'
        },

        /**
         * Backbone's init event
         */
        initialize:function (options) {
            _.bindAll(this, 'render');

            this.header = options.header;
        },

        /**
         * Renders form
         */
        render:function () {
            this.$el.html(this.modalTemplate({
                header:this.header
            }));
            return this;
        },

        /**
         * Confirm button has been clicked, hides the dialog
         * and triggers global modal:forgotpass
         * @see login.js
         */
        confirmAction:function (event) {
            event.preventDefault();
            this.$el.modal('hide');

            this.close();
            this.model.trigger('modal:forgot:pass');
        },

        /**
         * Cancel button has been cancelled. Hides dialog and
         * calls close to free up resources
         */
        cancelAction:function (event) {
            event.preventDefault();
            this.$el.modal('hide');

            this.close();
            this.model.trigger('modal:cancel');
        },

        /**
         * clears resources
         */
        close:function () {
            this.undelegateEvents();
            this.remove();
        }

    });

    return ModalInputView;
});
