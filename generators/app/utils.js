'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('underscore.string');
const clone = require('git-clone');
const rimraf = require('rimraf');

const config = require('./config');

module.exports = {
   getDefaultAppName: (appName) => {
      if (appName == undefined) {
         appName = path.basename(process.cwd());
      }
      return _.slugify(_.humanize(appName));
   },

   updatePackageConfig: (options, next) => {
      const fileName = path.resolve(options.appName, './package.json');
      const pack = require(fileName);
      pack.name = options.appName;
      fs.writeFile(fileName, JSON.stringify(pack, null, 3), (err) => {
         if(err) {
            next(err);
         }
         next(null);
      });
   },

   setupAppRepo: (options, next) => {
      const appPath = path.resolve('.', options.appName);
      if (fs.existsSync(appPath)) {
         next('Path already exists: ' + appPath);
      } else {
         clone(config.appGitPath, appPath, {}, () => {
            rimraf(appPath + '/.git', () => {
               next(null);
            });
         });
      }
   },
};
