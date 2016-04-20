/** @module */
import $script from 'scriptjs';

/**
 * Resolves external dependencies in order using script.js
 * @example <caption>From the module, export `dependencies` as an array of URLs</caption>
 * export const dependencies = [
 *   '//cdnjs.cloudflare.com/ajax/libs/jsforce/1.6.0/jsforce.min.js'
 * ];
 * @see [github.com/ded/script.js]{@link https://github.com/ded/script.js/}
 */
export function resolveExternal(mod, callback) {
  const len = mod.dependencies.length;
  const loadScript = (i=0) => {
    $script(mod.dependencies[i], i);
    $script.ready(i, () => {
      if (++i < len) {
        loadScript(i);
      } else {
        $script.done('bundle');
      }
    });
  };
  loadScript();
  $script.ready('bundle', callback);
};

/**
 * Parse `require.context` output
 * @param {Object} context - the return value of `require.context(...)`
 * @returns {Object} the modules keyed by their name
 */
export function parseContext(context) {
  const contextKeys = context.keys();
  const modules = {};

  for (let i = 0; i < contextKeys.length; i++) {
    let key = contextKeys[i];
    modules[key.replace(/^\.\//, '').replace(/\.js$/, '')] = context(key);
  }
  return modules;
};

/**
 * No-operation function
 */
export function noop() {};

/**
 * Get a value from an object using a query string
 */
export function objectQuery(obj, query) {
  query = query.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  query = query.replace(/^\./, '');           // strip a leading dot
  let parts = query.split('.');
  for (let i = 0, len = parts.length; i < len; ++i) {
    let key = parts[i];
    if (key in obj) {
      obj = obj[key];
    } else {
      return;
    }
  }
  return obj;
};
