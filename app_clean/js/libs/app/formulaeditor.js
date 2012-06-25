(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jquery','underscore','backbone','jqueryUIAutocomplete'], factory);
    } else {
        // Browser globals
        factory(jQuery, _, Backbone);
    }
}(function ($, _, Backbone) {

    if (!window.FE) window.FE = {};
    if (!FE.app)    FE.app    = {};
    if (!FE.ui)     FE.ui     = {};
    if (!FE.model)  FE.model  = {};
    if (!FE.utils)  FE.utils  = {};

    FE.FormulaEditor = function(options){
        var defaults = {
            container           : '',
            query               : '',
            minChars            : 1,
            dataSource          : [],

            tokenLimit          : null,
            tokenDelimiter      : ',',
            preventDuplicates   : false,

            // Output settings
            tokenValue          : 'id',
            propertyToSearch    : 'title',

            // Prepopulation settings
            prePopulate         : null,
            processPrePopulate  : false,

            // Manipulation settings
            idPrefix            : 'editor-',
            callbacks   : {
                onResult        : $.noop,
                onAdd           : $.noop,
                onDelete        : $.noop,
                onReady         : $.noop
            }
        };
        this.options           = _.extend({}, defaults, options);
        this.options.callbacks = _.extend({}, defaults.callbacks, options.callbacks);

        FE.app.hotkeys.initialize();


        this.addToken = function(item){
            this.formulaBox.tokenizer.addToken(item);
        }
        this.clear = function(){
            this.formulaBox.tokenizer.clear();
        }
        this.updateLocalData = function(data){

            var idx = null;
            _(this.options.dataSource).any(function(index){
                if(this.id===data.id)
                {
                    idx = index;
                    return false;
                }
            });
            if(idx !==null){
                this.options.dataSource[idx] = data;
            }
            else {
                this.options.dataSource.push(data);
            }
            this.formulaBox.tokenizer.setupAutocompleteSource(this.options.dataSource);
        }

        this.getDataSource = function() {
            return this.options.dataSource;
        }

        this.getInput = function() {
            return this.formulaBox.tokenizer.$hiddenInput.val();
        }

        this.getTokens = function() {
            return this.formulaBox.tokenizer.tokens;
        }

        this.formulaBox     = new FE.ui.FormulaBox({
            app: this
        });

        if (options.container) {
            var formulaBox = this.formulaBox.render().el;
            $(this.options.container).html(formulaBox);
            this.formulaBox.tokenizer.render();
        }
        // Disable page caching for browsers that incorrectly cache the visual search inputs.
        // This is forced the browser to re-render the page when it is retrieved in its history.
        $(window).bind('unload', function(e) {});

        // Gives the user back a reference to the `searchBox` so they
        // can use public methods.
        return this;
    };
    // Entry-point used to tie all parts of VisualSearch together. It will either attach
    // itself to `options.container`, or pass back the `searchBox` so it can be rendered
    // at will.
    FE.init = function(options) {
        return new FE.FormulaEditor(options);
    };

    FE.ui.FormulaBox = Backbone.View.extend({
        id: 'formula',

        initialize: function(options){
            this.app = options.app;
            this.tokenizer = new FE.ui.Tokenizer({
               app: this.app
            });
        },
        render: function(){
            console.log('FormulaBox rendering');
            $(this.el).append(JST['formula_box']({})).addClass('editor-formula-box-wrapper editor-formula-box');
            return this;
        }
    });

    FE.ui.Tokenizer = Backbone.View.extend({
        selectedToken       : null,
        selectedTokenIndex  : 0,

        initialize: function(options){
            _.bindAll(this,
                'clear', 'updateHiddenInput', 'checkTokenLimit', 'insertToken', 'selectToken', 'toggleSelectToken',
                'deselectToken', 'addToken', 'deleteToken', 'onKeyDown', 'onKeyPress', 'onBlur', 'render', 'resizeInput',
                'setupAutocompleteSource');

            this.tokens = [];
            this.app = options.app;
        },
        setupAutocompleteSource: function(source){
            this.$inputBox.autocomplete('option','source',source);
        },
        clear:function(){
            var self = this;
            this.$tokenList.children("li").each(function () {
                if ($(this).children("input").length === 0) {
                    self.deleteToken($(this));
                }
            });
        },
        updateHiddenInput: function(){
            var tokenValue = this.app.options.tokenValue;
            var propertyToSearch = this.app.options.propertyToSearch;
            var tokens = $.map(this.tokens, function(el){
                if (!el[tokenValue]) return false;

                return (el[tokenValue].match(/^o:/)) ?
                    el[tokenValue].substr(2) :
                    el[tokenValue] + ':' + el[propertyToSearch];
            });

            this.$hiddenInput.val(tokens.join(this.app.options.tokenDelimiter));
        },
        insertToken: function(item) {
            var token = $(JST['token'](item)).insertBefore(this.$inputToken);

            if(item.type !== 'text'){
                token.addClass(FE.app.classes.token);

            }
            else {
                token.addClass(FE.app.classes.tokenText);
            }

            var tokenData = {'id' : item.id, 'title': item.title};
            $.data(token.get(0), 'tokeninput', item);

            this.tokens = this.tokens.slice(0, this.selectedTokenIndex).concat([tokenData]).concat(this.tokens.slice(this.selectedTokenIndex));
            this.selectedTokenIndex++;

            this.updateHiddenInput();

            this.checkTokenLimit();

            return token;
        },
        deleteToken: function(t) {
            var data = $.data(t.get(0), 'tokeninput');

            var index = t.prevAll().length;
            if(index > this.selectedTokenIndex) {
                index--;
            }
            t.remove();
            this.selectedToken = null;

            this.$inputBox.focus();

            this.tokens = this.tokens.slice(0, index).concat(this.tokens.slice(index+1));

            this.updateHiddenInput();

            if(this.app.options.tokenLimit !== null){
                this.$inputBox
                    .show()
                    .val('')
                    .focus();
            }

            if($.isFunction(this.app.options.callbacks.onDelete)){
                this.app.options.callbacks.onDelete.call(this.$hiddenInput, data);
            }

        },
        selectToken: function(t){
            var data = $.data(t.get(0), 'tokeninput');
            if(data.type === 'text'){
                t.addClass(FE.app.classes.selectedTokenText);
            }
            else {
                t.addClass(FE.app.classes.selectedToken);
            }

            this.selectedToken = t.get(0);

            this.$inputBox.val();
        },
        toggleSelectToken: function(t) {
            var previous = this.selectedToken;

            if(this.selectedToken) {
                this.deselectToken(t, FE.app.position.END);
            }

            if(previous === t.get(0)){
                this.deselectToken(t, FE.app.position.END);
            }
            else {
                this.selectToken(t);
            }
        },
        deselectToken: function(t, position) {
            var token = $.data(t.get(0), 'tokeninput');
            if(token.type === 'text')
            {
                t.removeClass(FE.app.classes.selectedTokenText);
            }
            else {
                t.removeClass(FE.app.classes.selectedToken);
            }
            this.selectedToken = null;

            if(position === FE.app.position.BEFORE)
            {
                this.$inputToken.insertBefore(t);
                this.selectedTokenIndex--;
            }
            else if (position === FE.app.position.AFTER) {
                this.$inputToken.insertAfter(t);
                this.selectedTokenIndex++;
            }
            else {
                this.$inputToken.appendTo(this.$tokenList);
                this.selectedTokenIndex = this.tokens.length;
            }

            this.$inputBox.focus();
        },
        addToken: function(item, blockCb) {
            if(this.tokens.length && this.app.options.preventDuplicates){
                var found = false;
                _(this.tokens).any(function(t){
                    var data = $.data(t.get(0), 'tokeninput');
                    if(data && data.id === item.id)
                    {
                        found = t;
                        return false;
                    }
                });

                if(found) {
                    this.selectToken(found);
                    this.$inputToken.insertAfter(found);
                    this.$inputBox.focus();
                }
            }

            if(this.app.options.tokenLimit === null || this.tokens.length < this.app.options.tokenLimit){
                this.insertToken(item);
                this.checkTokenLimit();
            }

            this.$inputBox.val('');
            this.$inputBox.width(1);

            if($.isFunction(this.app.options.callbacks.onAdd) && !blockCb){
                this.app.options.callbacks.onAdd.call(this.$hiddenInput, item);
            }
        },
        checkTokenLimit: function() {
            if(this.app.options.tokenLimit !== null && this.tokens.length >= this.app.options.tokenLimit){
                this.$inputBox.hide();
                return;
            }
        },
        onKeyDown: function(e) {
            var previous;
            var next;
            var key = FE.app.hotkeys.key(e);

            switch(key) {
                case 'left':
                case 'right':
                    if(!this.$inputBox.val()) {
                        previous = this.$inputToken.prev();
                        next = this.$inputToken.next();

                        if((previous.length && previous.get(0)===this.selectedToken) ||
                            (next.length && next.get(0)===this.selectedToken)) {
                            if(key === 'left'){
                                this.deselectToken($(this.selectedToken), FE.app.position.BEFORE);
                            }
                            else {
                                this.deselectToken($(this.selectedToken), FE.app.position.AFTER);
                            }
                        }else if(key === 'left' && previous.length) {
                            this.selectToken(previous);
                        }else if(key === 'right' && next.length) {
                            this.selectToken(next);
                        }
                    }
                    break;
                case 'backspace':
                    previous = this.$inputToken.prev();
                    if(!this.$inputBox.val().length){
                        if(this.selectedToken) {
                            this.deleteToken($(this.selectedToken));
                            this.$hiddenInput.change();
                        }
                        else if(previous.length) {
                            this.selectToken(previous);
                            this.deleteToken($(this.selectedToken));
                            this.$hiddenInput.change();
                        }
                    }
                    break;
                case 'space':
                    var val = $.trim(this.$inputBox.val());
                    if(val.length) {
                        this.addToken({
                            id      : 'o:' +val,
                            title   : val,
                            type    : 'text'
                        });
                        this.$hiddenInput.change();
                    }
                    break;
            }
        },
        onKeyPress: function(e) {
            e.stopPropagation();

            var val = String.fromCharCode(e.which);

            var inputVal = $.trim(this.$inputBox.val());

            if (val && !inputVal.length && val.match(/[\d\+\-\/\*\%\(\)]/))
            {

                this.addToken({
                    id      :'o:' + val,
                    title   : val,
                    type    :'text'
                });

                this.$hiddenInput.change();

                return false;
            }

        },
        onBlur: function() {
            this.$inputBox.val('');
        },

        render: function() {
            var self = this;
            // build hidden input
            this.$hiddenInput = $(JST['formula_input']({}))
                .addClass('hidden_tokenizer')
                .hide();

            this.$inputBox = $(JST['formula_input']({}))
                .attr('id', this.app.options.idPrefix + this.$el.attr('id'))
                .css({
                    outline : 'none',
                    width   : '1px'
                })
                .addClass('tokenizer')
                .bind('keyup keydown blur update', this.resizeInput)
                .blur(this.onBlur)
                .keypress(this.onKeyPress)
                .keydown(this.onKeyDown);

            $('#formula_editor').append(this.$hiddenInput);

            this.$tokenList = $('<ul />')
                .addClass(FE.app.classes.tokenList)
                .click(function(e){
                    var li = $(e.target).closest('li');
                    if(li && li.get(0) && $.data(li.get(0), 'tokeninput')){
                        self.toggleSelectToken(li);
                    }
                    else {
                        if(self.selectedToken){
                            self.deselectToken($(self.selectedToken), FE.app.position.END);
                        }
                        self.$inputBox.focus();
                    }
                })
                .mouseover(function(e){
                    var li = $(e.target).closest('li');
                    if (li && self.selectedToken !== this) {
                        li.addClass(FE.app.classes.highlightedToken);
                    }
                })
                .mouseout(function(e){
                    var li = $(e.target).closest('li');
                    if (li && self.selectedToken !== this) {
                        li.addClass(FE.app.classes.highlightedToken);
                    }
                })
                .insertBefore(this.$hiddenInput);
            
            this.$inputToken = $('<li />')
                .addClass(FE.app.classes.inputToken)
                .appendTo(this.$tokenList)
                .append(this.$inputBox);

            this.$magicResizer = $('<div />')
                .insertAfter(this.$inputBox)
                .css({
                    position        : "absolute",
                    top             : -9999,
                    left            : -9999,
                    width           : "auto",
                    fontSize        : this.$inputBox.css("fontSize"),
                    fontFamily      : this.$inputBox.css("fontFamily"),
                    fontWeight      : this.$inputBox.css("fontWeight"),
                    letterSpacing   : this.$inputBox.css("letterSpacing"),
                    whiteSpace      : "nowrap"
                });
            this.$hiddenInput.val('');

            if($.isFunction(this.app.options.callbacks.onReady)){
                this.app.options.callbacks.onReady.call();
            }

            this.$inputBox.autocomplete({
                minLength   : 1,
                delay       : 0,
                position    : {
                    offset  : '0 5'
                },
                source: _.bind(function(req, responseFn) {

                    var re = $.ui.autocomplete.escapeRegex(req.term);
                    var matcher = new RegExp("^" + re, "i" );
                    var a = $.grep( this.app.getDataSource(), function(item,index){
                        return matcher.test(item.title);
                    });
                    if (!a.length && this.$inputBox.val().match(/[a-zA-Z]/))
                    {
                        this.$inputBox.val('');
                    }
                    responseFn( a );
                },this),
                focus: _.bind(function( event, ui ) {
                    this.$inputBox.val( ui.item.title );
                    return false;
                },this),
                select: _.bind(function(e, ui){
                    e.preventDefault();

                    this.addToken({id:ui.item.id,title:ui.item.title,type:'node'});
                },this)
            }).data( "autocomplete" )._renderItem = function( ul, item ) {
                var re = new RegExp("^" + this.term, "i") ;
                var t = item.title.replace(re,"<span style='font-weight:bold;color:Blue;'>" + this.term + "</span>");

                return $( "<li></li>" )
                    .data( "item.autocomplete", item )
                    .append( "<a>" + t + "<br /><span style='font-size:10px'>" + item.path + "</span></a>" )
                    .appendTo( ul );
            };;
        },

        resizeInput: function(){
            if( this.inputVal === (this.inputVal = this.$inputBox.val())) {
                return;
            }

            var escaped = this.inputVal.replace(/&/g, '&amp;').replace(/\s/g, ' ').replace(/</g, '&lt;').replace(/>/g, '&gt;');

            this.$magicResizer.html(escaped);

            if($.trim(this.$inputBox.val()).length) {
                this.$inputBox.width(this.$magicResizer.width() + 10);
            }
        }
    });



    FE.app.position = {
        BEFORE  : 0,
        AFTER   : 1,
        END     : 2
    };
    FE.app.classes = {
        tokenList           : "editor-list-facebook",
        token               : "editor-token-facebook",
        tokenText           : "editor-token-text",
        tokenDelete         : "editor-delete-token-facebook",
        selectedToken       : "editor-selected-token",
        selectedTokenText   : "editor-selected-token-text",
        highlightedToken    : "editor-highlighted-token-facebook",
        inputToken          : "editor-input-token-facebook"
    };
    FE.app.hotkeys = {
        // Keys that will be mapped to the `hotkeys` namespace.
        KEYS: {
            '16':  'shift',
            '17':  'command',
            '91':  'command',
            '93':  'command',
            '224': 'command',
            '13':  'enter',
            '37':  'left',
            '38':  'upArrow',
            '39':  'right',
            '40':  'downArrow',
            '46':  'delete',
            '8':   'backspace',
            '9':   'tab',
            '188': 'comma',
            '32': 'space'
        },
        // Binds global keydown and keyup events to listen for keys that match `this.KEYS`.
        initialize : function() {
            _.bindAll(this, 'down', 'up', 'blur');
            $(document).bind('keydown', this.down);
            $(document).bind('keyup', this.up);
            $(window).bind('blur', this.blur);
        },

        // On `keydown`, turn on all keys that match.
        down : function(e) {
            var key = this.KEYS[e.which];
            if (key) this[key] = true;
        },

        // On `keyup`, turn off all keys that match.
        up : function(e) {
            var key = this.KEYS[e.which];
            if (key) this[key] = false;
        },

        // If an input is blurred, all keys need to be turned off, since they are no longer
        // able to modify the document.
        blur : function(e) {
            for (var key in this.KEYS) this[this.KEYS[key]] = false;
        },

        // Check a key from an event and return the common english name.
        key : function(e) {
            return this.KEYS[e.which];
        },

        // Colon is special, since the value is different between browsers.
        colon : function(e) {
            var charCode = e.which;
            return charCode && String.fromCharCode(charCode) == ":";
        },

        // Check a key from an event and match it against any known characters.
        // The `keyCode` is different depending on the event type: `keydown` vs. `keypress`.
        //
        // These were determined by looping through every `keyCode` and `charCode` that
        // resulted from `keydown` and `keypress` events and counting what was printable.
        printable : function(e) {
            var code = e.which;
            if (e.type == 'keydown') {
                if (code == 32 ||                      // space
                    (code >= 48 && code <= 90) ||      // 0-1a-z
                    (code >= 96 && code <= 111) ||     // 0-9+-/*.
                    (code >= 186 && code <= 192) ||    // ;=,-./^
                    (code >= 219 && code <= 222)) {    // (\)'
                    return true;
                }
            } else {
                // [space]!"#$%&'()*+,-.0-9:;<=>?@A-Z[\]^_`a-z{|} and unicode characters
                if ((code >= 32 && code <= 126)  ||
                    (code >= 160 && code <= 500) ||
                    (String.fromCharCode(code) == ":")) {
                    return true;
                }
            }
            return false;
        }
    };
    // *******************************************************************************
    window.JST = window.JST || {};

    window.JST['formula_box'] = _.template('<div class="editor-icon editor-icon-formula"></div><div class="editor-formula-inner"><div id="formula_editor" ></div></div><div class="editor-icon editor-icon-cancel editor-cancel-formula-box" title="clear editor"></div>');
    window.JST['token'] = _.template('<li><p><%=title%></p></li>');
    window.JST['formula_input'] = _.template('<input type="text" autocomplete="off"/>');
}));