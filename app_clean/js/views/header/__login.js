/**
 *
 * LoginView object
 *
 * Renders an login boxes and handles login/logout processes
 * TODO: modify menu.js and login.js to handle login-logout from one file
 * reference too good auth sessions: http://backbonetutorials.com/cross-domain-sessions/
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'events',
    'tools',
    'views/msg/alert',
    'views/auth/forgot-pass',
    'views/auth/new-pass',
    'text!templates/header/login.html',
    'bootstrapDropdown'
], function ($, _, Backbone, Events, Tools, AlertView, ModalForgotPassView, ModalNewPassView, loginFormTemplate) {

    var HeaderLoginView = Backbone.View.extend({

        /**
         * Template element selector
         */
        el:'.menu',

        /**
         *  Initialize template
         */
        loginFormTemplate:_.template(loginFormTemplate),

        /**
         * Setup events
         */
        events:{
            'click button[name=login]':'login',
            'click #forgot-pass':'forgotPass'
        },

        /**
         * Backbone's initialize method
         */
        initialize:function () {
            _.bindAll(this, 'checkAuth', 'sendReset', 'newPassword', 'resetPassword', 'error', 'render', 'clean');

            // setup global events
            Events.on('sitePassreset', this.newPassword);

            this.model.on('error', this.error);

            /* this are called from the modal windows */
            this.model.on('modalForgotpass', this.sendReset);
            this.model.on('modalNewpass', this.resetPassword);

            // fire checkAuth event when the attribute authenticated of
            // the LoginModel has been changed
            this.model.on('change:authenticated', this.checkAuth);
        },

        /**
         * Checks authorization
         */
        checkAuth:function (model, value) {
            if (value) {

                // login has been successful, render main navigation
                Events.trigger('renderHeaderMenu', model);

                // now display dashboard
                Backbone.history.navigate('#/dashboard');
            }
            else {
                Backbone.history.navigate('#/index');
                this.render();
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

            this.modalForgotPassView = new ModalForgotPassView({
                model:this.model,
                header:'Password Reset'
            });
            $('.head').html(this.modalForgotPassView.render().el);
        },

        /**
         * Sends reset
         */
        sendReset:function () {
            this.model.url = 'api/site/forgotpass';
            this.model.save({
                username:this.modalForgotPassView.$('input[name=username]').val()
            });
        },

        /**
         * Renders new password form on a modal window
         */
        newPassword:function (pwResetToken) {
            this.pwResetToken = pwResetToken;
            this.modalNewPassView = new ModalNewPassView({
                model:this.model,
                header:'New Password'
            });
            $('.head').html(this.modalNewPassView.render().el);
            $('#modal').modal();
        },

        /**
         * Resets the password by setting a new url and fire the url
         * by trying to save the model attributes, which fires sync
         */
        resetPassword:function () {
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
            if(response.responseText)
            {
                var alertView = new AlertView({
                    msg:response.responseText,
                    type:'error'
                });
                $('.head').html(alertView.render().el);
            }
        },

        /**
         * Renders the login
         */
        render:function () {
            /* check whether is logged in */
            var params = Tools.getAuthParams();

            if (params) {
                /*
                 this will fire the checkAuth function which
                 will call the global event on app.js to render
                 the main menu and dashboard page
                 */
                this.model.set({
                    'username':params.username,
                    'token':params.token,
                    'authenticated':true
                });
            }
            else {
                this.$el.html(this.loginFormTemplate());
                this.delegateEvents();

                return this;
            }
        },

        /**
         * Clears resources
         */
        clean:function () {
            this.$el.html('');
        }

    });

    return HeaderLoginView;
})
;
