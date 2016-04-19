/** @module */
import $script from 'scriptjs';

/**
 * Resolves external dependencies using script.js
 * @example <caption>From the module, export `dependencies` as an array of URLs</caption>
 * export const dependencies = [
 *   '//cdnjs.cloudflare.com/ajax/libs/jsforce/1.6.0/jsforce.min.js'
 * ];
 * @see [github.com/ded/script.js]{@link https://github.com/ded/script.js/}
 */
export function resolveExternal(mod, callback) {
  $script(mod.dependencies || [], 'bundle');
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
