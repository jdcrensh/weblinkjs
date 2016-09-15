#!/usr/bin/env node

const async = require('async');
const jsforce = require('jsforce');
const path = require('path');
const zipDir = require('./zip-dir');
const argv = require('./argv');

const DIST_DIR = path.join(__dirname, '..', '..', 'dist');
const BUNDLE_NAME = 'weblinkjs';

const conn = new jsforce.Connection({
  loginUrl: argv.loginurl,
});

async.autoInject({
  bundle(done) {
    const bundle = zipDir(DIST_DIR, done);
    return bundle;
  },
  reportBundle(bundle, done) {
    const size = (bundle.size() / Math.pow(2, 20)).toFixed(2);
    console.log(`Bundled '${BUNDLE_NAME}' resource; size: ${size} MB\n`);
    async.setImmediate(done);
  },
  login(done) {
    conn.login(argv.username, argv.password + argv.token, (err, userInfo) => {
      if (!err) {
        console.log(`Logged in as ${argv.username}\n`);
      }
      return done(err, userInfo);
    });
  },
  deploy(login, reportBundle, bundle, done) {
    const metadata = {
      fullName: BUNDLE_NAME,
      contentType: 'application/zip',
      cacheControl: 'Public',
      content: bundle.getContentsAsString('base64'),
    };
    console.log(`Deploying '${BUNDLE_NAME}' static resource...\n`);
    return conn.metadata.upsert('StaticResource', metadata, done);
  },
}, (err) => {
  if (err) {
    console.error(err);
    return;
  }
  console.log('Success\n');
});
