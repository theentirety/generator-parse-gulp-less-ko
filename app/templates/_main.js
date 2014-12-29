/**
* scripts/main.js
*/

/* global $:false, ko:false, Parse:false, chrono:false, moment:false, document:false */

'use strict';

Parse.initialize('<%= parse_appid %>', '<%= parse_masterkey %>');

var App = require('./app.js');
var app;

<% if (facebookAppId) { %>

window.fbAsyncInit = function() {
  Parse.FacebookUtils.init({ // this line replaces FB.init({
    appId      : '<%= facebookAppId %>', // Facebook App ID
    status     : false, // check Facebook Login status
    cookie     : true, // enable cookies to allow Parse to access the session
    xfbml      : true,
    version    : 'v2.1'
  });
  // Run code after the Facebook SDK is loaded.
};

(function(d, s, id){
  var js, fjs = d.getElementsByTagName(s)[0];
  if (d.getElementById(id)) {return;}
  js = d.createElement(s); js.id = id;
  js.src = "//connect.facebook.net/en_US/sdk.js";
  fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

<% } %>

ko.bindingHandlers.fadeVisible = {
  init: function(element, valueAccessor) {
    // Initially set the element to be instantly visible/hidden depending on the value
    var value = valueAccessor();
    $(element).toggle(ko.unwrap(value)); // Use "unwrapObservable" so we can handle values that may or may not be observable
  },
  update: function(element, valueAccessor) {
    // Whenever the value subsequently changes, slowly fade the element in or out
    var value = valueAccessor();
    ko.unwrap(value) ? $(element).fadeIn(200) : $(element).fadeOut(200);
  }
};

/**
* This binding handler will load into a container external templates.  Once the templates have been added to the dom and bound, the element will fade in.
*/
ko.bindingHandlers.externalTemplates = {
  init: function(element, valueAccessor, allBindings, viewModel, bindingContext) {

    var url = ko.unwrap(valueAccessor());

    $(element).hide();

    $.ajax(url, {
        success: function(data) {
            $(element).prepend(data);
            ko.applyBindingsToDescendants(bindingContext, element);
            $(element).fadeIn('fast');
        }
    });

    // Also tell KO *not* to bind the descendants itself, otherwise they will be bound twice
    return { controlsDescendantBindings: true };
  }
};

$(document).on('ready', function() {
    app = new App();
});
