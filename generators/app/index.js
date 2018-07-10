'use strict';

const Generator = require('yeoman-generator');
const yeoWelcome = require('yeoman-welcome');
const chalk = require('chalk');

const prompts = require('./prompts');
const utils = require('./utils');

module.exports = class extends Generator {
   initializing() {
      this.log(yeoWelcome);
      this.log('This is an absolutely minimal Typescript-Webpack-React generator');
   }

   prompting() {
      this.prompt(prompts).then((answers) => {
         if (answers.appName != utils.getDefaultAppName()) {
            answers.appName = utils.getDefaultAppName(answers.appName);
         }

         this.appName = answers.appName;

         this.config.set('appName', this.appName);

         this.log(chalk.cyan('Generating app: ' + this.appName));
         const options = {appName: this.appName};
         this._setup(options);
      });
   }

   _setup(options) {
      utils.setupAppRepo(options, (err) => {
         if (err) {
            console.error(chalk.red('ERROR: ' + err));
         } else {
            utils.updatePackageConfig(options, (err) => {
               if (err) {
                  console.error(chalk.red('ERROR: ' + err));
               } else {
                  console.log(chalk.cyan("Done"));
                  console.log(chalk.yellow('View README.md in application root for instructions to run'));
               }
            });
         }
      });
   }
}
