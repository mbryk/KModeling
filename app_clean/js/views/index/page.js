define([
    'jquery',
    'underscore',
    'backbone',
    'session',
    'notifier',
    'text!templates/index/page.html',
    'bootstrapCollapse'
], function ($, _, Backbone, Session, Notifier, indexPageTemplate) {
    var indexPage = Backbone.View.extend({


        /**
         * Template element selector
         */
        el:'.page',

        /**
         *  Initialize template
         */
        indexPageTemplate:_.template(indexPageTemplate),

        /**
         * Setup events
         */
        events:{
            'click button[name=sign-in]':'login',
            'click #forgot-pass':'forgotPass'
        },

        /**
         * Backbone's initialize method
         */
        initialize:function () {
            _.bindAll(this, 'logout', 'checkAuth', 'sendReset', 'newPassword', 'resetPassword', 'error', 'render', 'clean');

            // setup global events
            Backbone.Events.on('site:reset:pass', this.newPassword);
            Backbone.Events.on('site:logout', this.logout);

            this.model.on('error', this.error);

            // fire checkAuth event when the attribute authenticated of
            // the LoginModel has been changed
            this.model.on('change:authenticated', this.checkAuth);

        },

        logout:function () {
            this.model.url = 'api/site/logout';
            this.model.save({
                username:this.model.get('username')
            });
        },
        /**
         * Checks authorization
         */
        checkAuth:function (model, value) {
            if (value) {
                // login has been successful, render main navigation
                Backbone.Events.trigger('render:header:dashboard:menu');

                // now display dashboard
                this.goTo('dashboard');
            }
            else {

                // now display index
                this.goTo('index');
            }

        },

        /**
         * Login user
         */
        login:function (e) {
            e.preventDefault();
            this.model.url = 'api/site/login';
            this.model.save({
                username:this.$('input[name=username]').val(),
                password:this.$('input[name=password]').val()
            });
        },


        /**
         * Password reset
         */
        forgotPass:function () {

            var that = this;

            require(['views/auth/forgot-pass'], function (ModalForgotPassView) {

                /* this are called from the modal windows */
                that.model.on('modal:forgot:pass', this.sendReset);

                that.modalForgotPassView = new ModalForgotPassView({
                    model:that.model,
                    header:'Password Reset'
                });
                that.modalForgotPassView.render().$el.modal();
            });
        },

        /**
         * Sends reset
         */
        sendReset:function () {
            this.model.off('modal:forgot:pass');
            this.model.url = 'api/site/forgotpass';
            this.model.save({
                username:this.modalForgotPassView.$('input[name=username]').val()
            });
        },

        /**
         * Renders new password form on a modal window
         */
        newPassword:function (pwResetToken) {

            var that = this;

            require(['views/auth/new-pass'], function (ModalNewPassView) {
                /* this are called from the modal windows */
                this.model.on('modal:new:pass', this.resetPassword);

                that.pwResetToken = pwResetToken;

                that.modalNewPassView = new ModalNewPassView({
                    model:that.model,
                    header:'New Password'
                });

                that.modalNewPassView.render().$el.modal();
            });
        },

        /**
         * Resets the password by setting a new url and fire the url
         * by trying to save the model attributes, which fires sync
         */
        resetPassword:function () {
            this.model.off('modal:new:pass');

            this.model.url = 'api/site/passreset';
            this.model.save({
                password:this.modalNewPassView.$('input[name=password]').val(),
                pw_reset_token:this.pwResetToken
            });
        },

        /**
         * Displays an inline error message
         */
        error:function (model, response) {
            if (response.responseText) {
                Notifier.notify(response.responseText, 'error');
            }
        },

        /**
         * Renders the login
         */
        render:function () {
            /* check whether is logged in, this is not done a */
            var that = this;

            Session.checkAuth(function (data) {
                if (!data.authenticated) {
                    that.model.set(data, {silent:true});
                    that.$el.html(that.indexPageTemplate());
                }
                else {
                    that.model.set(data);
                }
                return that;
            });
        },

        /**
         * Clears resources
         */
        clean:function () {
            Backbone.Events.off('site:reset:pass site:logout');
            this.model.off('change:authenticated');
        }
    });
    return indexPage;
});
