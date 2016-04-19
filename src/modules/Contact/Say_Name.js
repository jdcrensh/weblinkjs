/**
 * "Say Name" custom button on Contact.
 * This is an example module.
 * @module
 * @see module:weblinks
 */
import dialogs from 'dialogs';

/**
 * External dependencies: jsforce
 */
export const dependencies = [
  '//cdnjs.cloudflare.com/ajax/libs/jsforce/1.6.0/jsforce.min.js'
];

const greetings = [
  'Hello',
  'Salut',
  'Hallo',
  'Ciao',
  '¡Hola',
  'Shalom',
  "Kon'nichiwa",
  "G'day",
  'Bonjour'
];

const alertTypes = [
  'success',
  'error',
  'warning',
  'info',
  'question'
];

let timesClicked = 0;

const getRandomElement = (arr) => arr[Math.floor(Math.random() * arr.length)];

/**
 * @param {Object} params - the parameters passed to this module
 * @param {string} params.sessionId - `{!$Api.Session_ID}`
 * @param {string} params.userDisplayName - `'{!$User.FirstName} {!$User.LastName}'`
 * @param {string} params.contactId - `{!Contact.Id}`
 * @example <caption>Save the following in a Javascript button for Contact</caption>
 * {!REQUIRESCRIPT('/resource/weblinkjs/weblinks.js')}
 * weblinks.invoke('Contact/Say_Name', {
 *   sessionId: '{!API.Session_ID}',
 *   userDisplayName: '{!$User.FirstName} {!$User.LastName}',
 *   contactId: '{!Contact.Id}'
 * });
 */
export function exec({sessionId, userDisplayName, contactId}) {
  let conn = new jsforce.Connection({sessionId});
  const greeting = getRandomElement(greetings);
  const alertType = getRandomElement(alertTypes);

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
