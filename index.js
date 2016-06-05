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

  seneca.decorate('fire', (cmd, payload) => {
    return new Promise(function (resolve, reject) {
      if(process.env.NODE_ENV === 'development'){
        console.log('======== SENECA BEGIN =======');
        console.log('CMD : ',cmd);
        console.log('PAYLOAD : ',payload);
        console.log('======== SENECA END =======');

      }
      var args ={};
      args.fatal$ = false;
      args.default$ = {success:false,error:{message:'Service Down'}};
      args.payload = payload;

      seneca.act(cmd, args, (err, result) => {
        if (err) {
          seneca.log.info('Seneca-sanitize error firing:', args, '\n\n', err);
          reject(err);
        }

        if (result.success) {
          return result.payload ? resolve(result.payload) : resolve();
        } else {

          let error = new Error(result.error.message);

          _.extend(error, result.error);
          return reject(error);
        }

      })
    });

  });

  return {
    name: 'errorTransform'
  }

};
