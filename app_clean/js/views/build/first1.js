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
    'text!templates/build/first1.html',
    'bootstrapModal',
    'backboneBinder',
    'backboneValidation'
], function ($, _, Backbone, ModalTemplate) {

    var NewFirstView = Backbone.View.extend({
        /**
         * Element's id
         */
        id:'modal',

        /**
         * Init view template
         */
        modalTemplate:_.template(ModalTemplate),

        _modelBinder:undefined,

        /**
         * setup events
         */
        events:{
            'click .confirm':'nextModal',
            'click .cancel':'cancelAction',
        },

        /**
         * Backbone's initialization event
         */
        initialize:function (options) {
            _.bindAll(this, 'render');

            this.header = options.header;
            /* modifying collection to avoid collisions with validation plugin */

            this._modelBinder = new Backbone.ModelBinder();

            var that = this;

            // setup Backbone.Validation on our form
            Backbone.Validation.bind(this, {
                valid:function (view, attr) {
                    var $input = that.$('input[name=' + attr + ']');
                    if ($input.length) {
                        $input.parents('.control-group').removeClass('error').find('span').text('');
                    }
                },
                invalid:function (view, attr, error) {
                    var $input = that.$('input[name=' + attr + ']');
                    if ($input.length && !$input.parents('.control-group').hasClass('error')) {
                        $input.parents('.control-group').addClass('error').find('span').text(error);
                    }
                }
            });

        },
        /**
         * Render form
         */
        render:function () {
            this.$el.html(this.modalTemplate({
                header:this.header,
            }));

            this._modelBinder.bind(this.model, this.el);

            return this;
        },

        forceNumericOnly:function (e) {
            var key = e.charCode || e.keyCode || 0;
            // allow backspace, tab, delete, arrows, numbers and keypad numbers ONLY
            return (
                key == 8 ||
                key == 9 ||
                key == 46 ||
                (key >= 37 && key <= 40) ||
                (key >= 48 && key <= 57) ||
                (key >= 96 && key <= 105));
        },

        /**
         * Confirm button clicked, close dialog and trigger
         * modal:new:project
         * @see dashboard.js newProject
         */
        nextModal:function (e) {
            e.preventDefault();
            var that = this;
            /* dashboard holds logged user, and logged user should have its id */
            /* lets put bogus one for now */
            require(['models/build', 'views/build/first2'],
                function (BuildModel, NewFirstView) {

                    that.newFirstView = new NewFirstView({header:'Continue Build', model:that.model});
                    that.$el.modal('hide');

                    that.newFirstView.render().$el.modal();
                    return false;
                });
        },

        /**
         * Cancel button clicked, hide dialog and clear resources
         * Triggers global modal:cancel -if set
         */
        cancelAction:function (e) {
            e.preventDefault();

            this.$el.modal('hide');
            this.close();
        },

        /**
         * Clears resources
         */
        close:function () {
            this._modelBinder.unbind();
            this.model.off();
            this.undelegateEvents();
            this.remove();
        }

    });

    return NewFirstView;
});
