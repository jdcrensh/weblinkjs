module.exports = require('yargs')
  .usage('npm run deploy -- [args]')
  .strict()
  .options({
    username: {
      alias: 'u',
      describe: 'Your Salesforce username',
      demand: true,
    },
    password: {
      alias: 'p',
      describe: 'Your Salesforce password',
      demand: true,
    },
    token: {
      alias: 't',
      describe: 'Your Salesforce security token',
    },
    loginurl: {
      alias: 'l',
      describe: 'Your Salesforce login URL',
      default: 'https://test.salesforce.com',
    },
  })
  .wrap(85)
  .help()
  .argv;
