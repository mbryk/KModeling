/**
 * LoginModel object
 * 
 * Model containing the interactive data as well as a large part of the logic 
 * surrounding it: conversions, validations, computed properties, 
 * and access control of LoginModel.
 * 
 * Here is where we need to setup logic with database
 * 
 */
define([
	'jquery', 
	'underscore', 
	'backbone'
	], function($, _, Backbone) {

		var LoginModel = Backbone.Model.extend({
    
			defaults:{
				authenticated: false
			}
		});

		return LoginModel;
	});

