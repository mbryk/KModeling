/**
 * Application router
 *
 * Backbone routers are used for routing your applications URL’s when using hash tags(#)
 * @see http://backbonetutorials.com/what-is-a-router/
 */
define([
    'jquery',
    'underscore',
    'backbone',
    'vm',
    'http',
    'session'
], function ($, _, Backbone, Vm, Http, Session) {

    var AppRouter = Backbone.Router.extend({
        /**
         * The routes hash maps URLs with parameters to functions
         * on your router, similar to the View's events hash.
         *
         * @see http://documentcloud.github.com/backbone/#Router-routes
         */
        routes:{
            '.*':'index', // /
            'index':'index', // #/index
            'reset':'reset', // #/reset
            'settings':'settings', // #/settings
            'dashboard':'dashboard', // #/dashboard
            'mindmap/:id':'mindmap', // #/mindmap/id
            'error/:number':'error', // #/error/number
            'build':'build',
            
            // paths not found
            '*path':'notFound'

        }
    });

    /**
     * this method is called in every backboneJS object
     */
    var initialize = function (options) {

        var appView = options.appView;

        var router = new AppRouter(options);

        router.on('route:notFound', function () {
            // path not found, display 404 error!
            this.navigate('error/404', {trigger:true});
        });

        router.on('route:error', function (actions) {

            require(['views/error/page'], function (ErrorPage) {
                if (Http.isUnAuthorized(actions)) {
                    router.navigate('index', {trigger:true});
                    return false;
                }
                var description = Http.getStatusDescription(actions) || 'Unknown';

                var ErrorView = Vm.create(appView, 'ErrorPage', ErrorPage, {number:actions, description:description});

                ErrorView.render();
            });
        });

        router.on('route:defaultAction route:dashboard', function (actions) {

            /* render dashboard as default action */
            require(['views/dashboard/page'], function (DashboardPage) {

                var DashboardView = Vm.create(appView, 'DashboardPage', DashboardPage);

                DashboardView.render();
            });
        });

        router.on('route:settings', function () {

            require(['views/settings/page'], function (SettingsPage) {

                var SettingsView = Vm.create(appView, 'SettingsView', SettingsPage);

                SettingsView.render();
            });
        });

        router.on('route:mindmap', function (actions) {

            require(['views/mindmap/page'], function (MindmapPage) {

                var MindmapView = Vm.create(appView, 'MindmapPage', MindmapPage, {mindmapId:actions});

                MindmapView.render();
            });
        });
        
        router.on('route:build', function (actions) {

            require(['views/build/profile'], function (BuildPage) {

                var BuildView = Vm.create(appView, 'BuildPage', BuildPage, {buildId:actions});

                BuildView.render();
            });
        });        

        router.on('route:reset', function () {
            /* TODO this doesn't actually work, needed to change it or remove it completely*/
            Backbone.history.navigate('/site/reset', true);
        });

        router.on('route:index', function () {
            appView.render();
        });

        // start the router
        Backbone.history.start();

        // initialize Http object to make backbone work with POST instead of GET
        Http.initialize({type:'POST'});

        // filter all http for errors
        Http.onAjaxError(function (number) {
            router.navigate('error/' + number, {trigger:true});
        })
            .onAjaxStart(function () {
                $('#loader').show();
            })
            .onAjaxComplete(function () {
                $('#loader').hide();
            })

        // initialize Backbone custom extensions
        Backbone.View.prototype.goTo = function (loc, options)
        {
            router.navigate(loc, _.extend({trigger:true},options || {}));
        }

        /* lets override Backbone.Model.toJSON to include CSRF cookie validation */
        Backbone.Model.prototype.toJSON = function () {
            return $('meta[name=csrf]').length ? _(_.clone(this.attributes)).extend({
                // yii defaults to YII_CSRF_TOKEN, we can easily change that on main.php
                'YII_CSRF_TOKEN':$('meta[name=csrf]').attr('content')
            }) : _.clone(this.attributes);
        };

    }

    return {
        initialize:initialize
    };
});