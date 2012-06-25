/**
 * main configuration file
 */
// Use ECMAScript 5 Strict Mode
"use strict";

// Define jQuery as AMD module
define.amd.jQuery = true;

// Require.js allows us to configure mappings to paths
// as demonstrated below:
// TODO: Load minified version of the libs or use Require.js's JS compiler (R)
require.config({
    paths: {

        /* jquery + jquery-ui + jquery-plugins*/
        jquery               : [
            'http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min',
            'libs/jquery/jquery-1.7.1.min'
        ],
        jqueryUICore         : 'libs/jquery-ui/jquery.ui.core',
        jqueryUIWidget       : 'libs/jquery-ui/jquery.ui.widget',
        jqueryUIMouse        : 'libs/jquery-ui/jquery.ui.mouse',
        jqueryUIPosition     : 'libs/jquery-ui/jquery.ui.position',
        jqueryUIAutocomplete : 'libs/jquery-ui/jquery.ui.autocomplete',
        jqueryUIDatepicker   : 'libs/jquery-ui/jquery.ui.datepicker',
        jqueryUIDraggable    : 'libs/jquery-ui/jquery.ui.draggable',
        jqueryUIDroppable    : 'libs/jquery-ui/jquery.ui.droppable',
        jqueryUISortable     : 'libs/jquery-ui/jquery.ui.sortable',
        jqueryUISlider       : 'libs/jquery-ui/jquery.ui.slider',
        jqueryCookie         : 'libs/jquery-plugins/jquery.cookie',

        /* bootstrap - we can also use bootstrap loader */
        bootstrapAlert       : 'libs/bootstrap/bootstrap-alert',
        bootstrapButton      : 'libs/bootstrap/bootstrap-button',
        bootstrapCarousel    : 'libs/bootstrap/bootstra-carousel',
        bootstrapCollapse    : 'libs/bootstrap/bootstrap-collapse',
        bootstrapDropdown    : 'libs/bootstrap/bootstrap-dropdown',
        bootstrapModal       : 'libs/bootstrap/bootstrap-modal',
        bootstrapPopover     : 'libs/bootstrap/bootstrap-popover',
        bootstrapScrollspy   : 'libs/bootstrap/bootstrap-scrollspy',
        bootstrapTab         : 'libs/bootstrap/bootstrap-tab',
        bootstrapTooltip     : 'libs/bootstrap/boostrap-tooltip',
        bootstrapTransition  : 'libs/bootstrap/bootstrap-transition',
        bootstrapTypeahead   : 'libs/bootstrap/bootstrap-typeahead',

        /* underscore */
        underscore           : 'libs/underscore/underscore',
        underscoreString     : 'libs/underscore/underscore.string',

        /* backbone */
        backbone             : 'libs/backbone/backbone',
        backboneRelational   : 'libs/backbone/backbone-relational',
        backboneBinder       : 'libs/backbone/backbone.model-binder',
        backboneValidation   : 'libs/backbone/backbone.validation',

        /* requirejs plugins*/
        text                 : 'libs/require/text',
        domReady             : 'libs/require/domReady',

        /* app */
        formulaeditor        : 'libs/app/formulaeditor',

        /* d3 */
        d3                   : 'libs/d3/d3',
        d3Layout             : 'libs/d3/d3.layout',

        /* utility libraries */
        json                 : 'libs/utils/json2',
        matrix               : 'libs/utils/matrix',
        stringFormat         : 'libs/utils/string-format', /* TODO: move away to the object that actually requires it */
        parser               : 'libs/utils/parser',
        treefix              : 'libs/utils/treefix',
        constants            : 'libs/utils/constants',
        session              : 'libs/utils/session',
        http                 : 'libs/utils/http',
        notifier             : 'libs/utils/notifier',
        engine               : 'libs/utils/engine',
        /* a shortcut to have the templates outside of the js directory */
        templates            : '../templates'
    },

    waitSeconds:15
});

// Let's kick off the application

require([
    'views/app',
    'router',
    'vm',
    'jquery'
], function (AppView, Router, Vm, $) {

    var appView = Vm.create({}, 'AppView', AppView);

    appView.render();

    Router.initialize({appView:appView});  // The router now has a copy of all main appview
});
