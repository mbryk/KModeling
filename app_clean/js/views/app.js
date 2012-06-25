define([
    'jquery',
    'underscore',
    'backbone',
    'vm',
    'models/login',
    'constants'
], function ($, _, Backbone, Vm, LoginModel, Constants) {
    var AppView = Backbone.View.extend({

        initialize:function (options) {

            /* no initialization for templates as it is already displayed by server */
            Backbone.Events.on('render:header:menu', this.renderHeaderMenu);
            Backbone.Events.on('render:header:dashboard:menu', this.renderHeaderDashboardMenu);
        },

        renderHeaderMenu:function () {

            var self = this;
            require(['views/header/menu'], function (HeaderMenuView) {
                /* we do use HeaderMenuView again to clean the Login */
                var headerMenuView = Vm.create(self, 'HeaderMenuView', HeaderMenuView, {appView: self});
                headerMenuView.render();
            });
        },

        renderHeaderDashboardMenu:function () {
            var self = this;
            require(['views/header/dashboard'], function (DashboardHeaderMenuView) {
                /* we do use HeaderMenuView as HeaderMenuView -projects also share common name, so we make sure VM
                cleans resources */
                var dashboardHeaderMenuView = Vm.create(self, 'HeaderMenuView', DashboardHeaderMenuView, {appView: self});
                dashboardHeaderMenuView.render();
            });

            /* download unit types */
            /* and setup the collection to Constants object */
            require(['collections/unit'], function(UnitCollection){
                Constants.UNITS = new UnitCollection();
                Constants.UNITS.fetch();
            });
        },

        render:function () {
            var self = this;
            var loginModel = new LoginModel;
            Vm.clean('HeaderMenuView');

            require(['views/index/page'], function (IndexPageView) {
                var indexPageView = Vm.create(self, 'IndexPageView', IndexPageView, {model:loginModel});
                indexPageView.render();
            });

            require(['views/footer/footer'], function (FooterView) {
                var footerView = Vm.create(self, 'FooterView', FooterView);
                footerView.render();
            });
        }
    });
    return AppView;
});
