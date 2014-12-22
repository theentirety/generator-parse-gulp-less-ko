'use strict';
var yeoman = require('yeoman-generator');
var chalk = require('chalk');
var yosay = require('yosay');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    // Have Yeoman greet the user.
    this.log(yosay(
      'Welcome to the remarkable ' + chalk.red('ParseGulpLessKo') + ' generator!'
    ));

    var prompts = [{
        name: 'appName',
        message: 'What is your app\'s name?',
        required: true
    },{
        type: 'confirm',
        name: 'parseCLIInstalled',
        message: 'Have you already installed the Parse.com CLI?',
        default: true
    },{
        when: function (response) {
          return !response.parseCLIInstalled;
        },
        name: 'parseInstallCLI',
        message: 'Install the Parse.com command line tool (Mac/Linux only)?',
        default: true
    },{
        type: 'confirm',
        name: 'parseExists',
        message: 'Have you created your app on Parse.com?',
        default: true
    },{
        when: function (response) {
          return !response.parseExists;
        },
        type: 'confirm',
        name: 'parseGoInstall',
        message: 'Please go create your app on Parse.com. We\'ll wait here... ready?',
        default: true
    }
    ];

    this.prompt(prompts, function (props) {
        this.appName = props.appName;
        this.installParse = !props.parseExists;
        this.parseInstallCLI = props.parseInstallCLI;
        this.parseCLIInstalled = props.parseCLIInstalled;
        this.parseAppName = this._.classify(props.appName);

        done();
    }.bind(this));
  },

  scaffoldFolders: function(){
      this.mkdir(this.destinationPath('bower_components'));
      this.mkdir(this.destinationPath('app'));
      this.mkdir(this.destinationPath('app/fonts'));
      this.mkdir(this.destinationPath('app/fonts/fonts'));
      this.mkdir(this.destinationPath('app/fonts/icons'));
      this.mkdir(this.destinationPath('app/fonts/packages'));
      this.mkdir(this.destinationPath('app/images'));
      this.mkdir(this.destinationPath('app/less'));
      this.mkdir(this.destinationPath('app/less/modules'));
      this.mkdir(this.destinationPath('app/scripts'));
      this.mkdir(this.destinationPath('app/scripts/modules'));
      this.mkdir(this.destinationPath('app/templates'));
      this.mkdir(this.destinationPath('build'));
      this.mkdir(this.destinationPath('dist'));
  },

  writing: {
    app: function () {

      var context = {
          site_name: this.appName,
          site_prefix: this._.classify(this.appName)
      };

      this.fs.copy(this.templatePath('_package.json'), this.destinationPath('package.json'));
      this.fs.copy(this.templatePath('_bower.json'), this.destinationPath('bower.json'));
      this.fs.copy(this.templatePath('_gulpfile.js'), this.destinationPath('gulpfile.js'));

      this.fs.copy(this.templatePath('_main.js'), this.destinationPath('app/scripts/main.js'));
      this.fs.copy(this.templatePath('_app.js'), this.destinationPath('app/scripts/app.js'));

      this.fs.copy(this.templatePath('_app.less'), this.destinationPath('app/less/app.less'));
      this.fs.copy(this.templatePath('_base.less'), this.destinationPath('app/less/_base.less'));
      this.fs.copy(this.templatePath('_fonts.less'), this.destinationPath('app/less/fonts.less'));

      this.template(this.templatePath('_mixins.less'), this.destinationPath('app/less/mixins.less'), context);

      this.template(this.templatePath('_auth.html'), this.destinationPath('app/templates/auth.html'), context);
      this.template(this.templatePath('_auth.less'), this.destinationPath('app/less/modules/auth.less'), context);
      this.template(this.templatePath('_auth.js'), this.destinationPath('app/scripts/modules/auth.js'), context);

      this.template(this.templatePath('_index.html'), this.destinationPath('app/index.html'), context);
    },

    projectfiles: function () {
      this.fs.copy(this.templatePath('editorconfig'), this.destinationPath('.editorconfig'));
      this.fs.copy(this.templatePath('jshintrc'), this.destinationPath('.jshintrc'));
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });

    // install the parse cli
    if (!this.parseCLIInstalled) {
      if (this.parseInstallCLI) {
        this.log('Installing Parse.com CLI...');
        this.spawnCommand('curl', ['-s', 'https://www.parse.com/downloads/cloud_code/installer.sh | sudo /bin/bash']);
        this.log('Parse.com CLI installed.');
      } else {
        this.log('For PC Parse.com CLI, go to https://parse.com/docs/cloud_code_guide and download the installer.');
      }
    }

    // create the parse app
    this.log('Creating Parse.com app...');
    this.spawnCommand('parse', ['new', 'dist']);

  }
});
