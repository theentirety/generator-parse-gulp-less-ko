/**
 * scripts/app.js
 *
 * This is a sample CommonJS module.
 * Take a look at http://browserify.org/ for more info
 */

 /* global ko:false, pager:false */

'use strict';

function App() {
  var self = this;
  self.modules = {};

  console.log('App running...')

  pager.extendWithPage(self.modules);
  ko.applyBindings(self.modules);
  pager.start();

  var Auth = require('./modules/auth.js');

  self.modules.auth = new Auth();

  return self;
}

module.exports = App;
