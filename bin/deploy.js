#!/usr/bin/env node

var async = require('async');
var fs = require('fs-extra');
var jsforce = require('jsforce');
var path = require('path');
var yargs = require('yargs');

var argv = yargs
  .usage('npm run deploy -- [args]')
  .strict()
  .options({
    username: {
      alias: 'u',
      describe: 'Your Salesforce username',
      demand: true
    },
    password: {
      alias: 'p',
      describe: 'Your Salesforce password',
      demand: true
    },
    token: {
      alias: 't',
      describe: 'Your Salesforce security token'
    },
    loginurl: {
      alias: 'l',
      describe: 'Your Salesforce login URL',
      default: 'https://test.salesforce.com'
    }
  })
  .wrap(85)
  .help()
  .argv;

var DIST_DIR = path.join(__dirname, '..', 'dist');

var conn = new jsforce.Connection({
  loginUrl: argv.loginurl
});

async.autoInject({
  bundle: function (done) {
    var streamBuffers = require('stream-buffers');
    var fs = require('fs');
    var archiver = require('archiver');

    var output = new streamBuffers.WritableStreamBuffer({
      initialSize: (100 * 1024),   // start at 100 kilobytes.
      incrementAmount: (10 * 1024) // grow by 10 kilobytes each time buffer overflows.);
    });
    var archive = archiver('zip');
    archive.on('end', function () {
      done(null, output);
    });
    archive.on('error', done);
    archive.pipe(output);
    archive.directory(DIST_DIR, '/');
    archive.finalize();
  },
  login: function (done) {
    conn.login(argv.username, argv.password + argv.token, function (err, userInfo) {
      if (!err) {
        console.log('Logged in as ' + argv.username + '\n');
      }
      return done(err, userInfo);
    });
  },
  deploy: function (login, bundle, done) {
    var metadata = {
      fullName: 'weblinkjs',
      contentType: 'application/zip',
      cacheControl: 'Public',
      content: bundle.getContentsAsString('base64')
    };
    console.log('Deploying \'weblinkjs\' static resource...\n');
    conn.metadata.upsert('StaticResource', metadata, done);
  }
}, function (err) {
  if (err) {
    return console.error(err);
  }
  console.log('Success\n');
});
