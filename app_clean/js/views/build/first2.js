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
    'text!templates/build/first2.html',
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
            'click #done':'submitBuild1'
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


        /**
         * Confirm button clicked, close dialog and trigger
         * modal:new:project
         * @see dashboard.js newProject
         */
        submitBuild1:function (e) {
            e.preventDefault();
            
            this.model.validate();
            alert(this.model.isValid());
            if(this.model.isValid())
            {
                this.$el.modal('hide');
                
                //this.model.trigger('new:build:submit1');
                this.model.save();
                this.close();
            }
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
