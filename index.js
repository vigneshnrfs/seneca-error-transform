/**
 * Created by zapstitch on 13/5/16.
 */
'use strict';

var Promise = require('bluebird');
var _ = require('lodash');

module.exports = function (options) {
  const seneca = this;
  //const winston = options.winston;
  delete seneca.fixedargs.fatal$;

  seneca.decorate('fire', (cmd, args, test) => {
    console.log(cmd, args, test);
    return new Promise(function (resolve, reject) {

      seneca.act(cmd, args, (err, result) => {
        if (err) {
          seneca.log.info('Seneca-sanitize error firing:', args, '\n\n', err);
          reject(err);
        }

        if (result.success) {
          return result.payload ? resolve(result.payload) : resolve();
        } else {

          let error = new Error(result.error.errorMessage || result.error.message);
          console.log(error);
          _.merge(error, result.error);
          console.log(error);
          return reject(error);
        }

      })
    });

  });

  return {
    name: 'errorTransform'
  }

};
