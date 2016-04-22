/**
 * "Say Name" custom button on Contact.
 * This is an example module.
 * @module
 * @see module:weblinks
 */
import dialogs from 'dialogs';
import config from './config.json';

export {config};

/**
 * Keep track of the number of times the user has clicked the button
 */
let timesClicked = 0;

/**
 * Get a random element from the given Array
 * @param {Array} arr - the Array
 * @returns a random element from the Array
 */
const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * @param {Object} params - the parameters passed to this module
 * @param {string} params.sessionId - `{!$Api.Session_ID}`
 * @param {string} params.userDisplayName - `'{!$User.FirstName} {!$User.LastName}'`
 * @param {string} params.contactId - `{!Contact.Id}`
 * @example <caption>Save the following in a Javascript button for Contact</caption>
 * {!REQUIRESCRIPT('/resource/weblinkjs/weblinks.js')}
 * 'use strict';
 * weblinks.invoke('Contact/Say_Name', {
 *   sessionId: '{!API.Session_ID}',
 *   userDisplayName: '{!$User.FirstName} {!$User.LastName}',
 *   contactId: '{!Contact.Id}'
 * });
 */
export function exec({sessionId, userDisplayName, contactId}) {
  let conn = new jsforce.Connection({sessionId});
  const greeting = getRandomElement(config.greetings);
  const alertType = getRandomElement(config.alertTypes);

  // Get this contact's record, then show a message
  conn.sobject('Contact').retrieve(contactId, (err, contact) => {
    if (err) { return alert(err); }
    const s = ++timesClicked > 1 ? 's' : '';
    dialogs.alert(
      `${greeting} ${userDisplayName}!`,
      `This contact's name is ${contact.FirstName} ${contact.LastName}, ` +
      `and you've clicked this button ${timesClicked} time${s}.`,
      alertType
    );
  });
};