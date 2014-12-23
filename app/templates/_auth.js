/**
 * scripts/auth.js
 */

'use strict';

function Auth() {
	var self = this;

	self.currentUser = ko.observable();
	self.editMode = ko.observable(false);

	self.init = function() {
		var currentUser = Parse.User.current();
		if (currentUser) {
			self.currentUser(currentUser);
		}
	};

	self.signin = function() {

<% if (facebookAppId) { %>
		Parse.FacebookUtils.logIn(null, {
			success: function(user) {
				self.currentUser(user);
				if (user.attributes.admin == true) {
					self.editMode(true);
				}
			},
			error: function(user, error) {
				console.log("User cancelled the Facebook login or did not fully authorize.");
			}
		});

<% } %>
<% if (!facebookAppId) { %>
    // Parse.FacebookUtils.logIn(null, {
    //   success: function(user) {
    //     self.currentUser(user);
    //     if (user.attributes.admin == true) {
    //       self.editMode(true);
    //     }
    //   },
    //   error: function(user, error) {
    //     console.log("User cancelled the Facebook login or did not fully authorize.");
    //   }
    // });

<% } %>
	};

	self.signout = function() {
		Parse.User.logOut();
		self.currentUser(null);
		pager.navigate('');
	};

	self.init();

	return self;
}

module.exports = Auth;
