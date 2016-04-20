# weblinkjs

* [API Documentation](https://jdcrensh.github.io/weblinkjs/docs)

An abstraction built around building, deploying, and invoking Javascript
through custom buttons/links (weblinks) in Salesforce. Including an added
benefit of developing using ES6 Javascript (with Babel).

The project may be used as a template for centralizing an org's custom weblink
javascript. Either fork this repository through Github, or clone and push to
your own public/private remote.


## Usage

By convention, code for each weblink is defined inside a javascript module
with paths that conform to `modules/<SObjectType>/<Weblink API Name>/index.js`.
Note, this isn't strictly enforced, so you may adapt using your own naming
conventions, as long as the modules reside in `src/modules/`.

Since these are self-contained modules, code stored on the weblink itself
is fairly minimal:

```javascript
{!REQUIRESCRIPT('/resource/weblinkjs/weblinks.js')}

weblinks.invoke('Account/My_Custom_Weblink');
```

Whereas its module would implement the logic:

```javascript
// src/modules/Account/My_Custom_Weblink/index.js
export function exec(params) {
  alert('hello world!');
};
```


### Example

See [Contact/Say_Name](src/modules/Contact/Say_Name/index.js)


### Parameters

One minor drawback of moving code to static resources is that merge fields
cannot be parsed. To get around this limitation, you can pass them as named
parameters for the module to parse.

```javascript
{!REQUIRESCRIPT('/resource/weblinkjs')}
'use strict';

weblinks.invoke('Account/My_Custom_Weblink', {
  sessionId: '{!API.Session_ID}',
  id: '{!Work_Order__c.Id}'
});
```

Be aware that other than the record's Id, most values **cannot** be relied on
to be up-to-date. Merge fields are only evaluated once; i.e. the moment before
the page is loaded.

One potentially common scenario where this would be problematic occurs when one
user (Bob) opens a record's detail page, then a few moments later, the same
user (or some other, doesn't matter) makes some field update that would result
in the value differing from the value it was the moment before the page was
initially loaded by Bob. In this scenario, if Bob then clicks a javascript
button using merge fields, the data he'd be using will now be out-of-date.

A solution to the above scenario is to only pass the record's Id, and use
Ajax to query the record every time the button is clicked (using Salesforce's
`connection.js` or [`jsforce`](https://jsforce.github.io) via CDN). Note that
this has a downside of its own, which is that it counts against the limit of
API calls your org can make in a single day.


## Development

Requirements:

- [Node.js](https://nodejs.org/en/)
- [Git](https://git-scm.com/)
- Some kind of shell prompt
  - Good options for Windows are [Cygwin](https://www.cygwin.com/) or Git BASH
    (included in the Windows Git installation).

Launch a Bash-like shell, clone this repo to where your projects live, then install:

```bash
npm install
```

Now you may either edit an existing module, located in `modules`,
or create a new one.

To create a module for a weblink, create a folder for the module with the path
`modules/<SObjectType>/<Weblink API Name>/`.

Create a folder if one doesn't already exist for the SObjectType. Also create an
`index.js` file that will be used solely to import modules of this type and export them
to `modules/index.js` (of which will also need to be edited to include the new
SObjectType folder).

In the module's folder, create `index.js`, which will be the module's entry point.

An example template for `index.js`:

```javascript
export const dependencies = [
  '//mycdn.com/path/to/cdn/resource'
];
export function exec(params) {
  // ... your weblink code goes here, parsing params as you see fit ...
};
```

**Remember** to also add code for invoking the module in the weblink itself,
as shown in the Usage section above.

Once you're done making changes, build the library:

```bash
npm run build
```

Then deploy using your Salesforce credentials:

```bash
npm run deploy -- -u <username> -p <password> -t <security token> -l https://test.salesforce.com
```

To save time, you could build and deploy at the same time:

```bash
npm run build && npm run deploy -- -u <username> -p <password> -t <security token> -l https://test.salesforce.com
```
