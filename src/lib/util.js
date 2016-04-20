/** @module */
import $script from 'scriptjs';

/**
 * Resolves external dependencies in order using script.js
 *
 * @example <caption>From the module, export `dependencies` as an array of URLs</caption>
 * export const dependencies = [
 *   '//cdnjs.cloudflare.com/ajax/libs/jsforce/1.6.0/jsforce.min.js'
 * ];
 *
 * @example <caption>If `dependencies` is not an export, also checks for a `config` export</caption>
 * // config.json
 * {"dependencies": ["//cdnjs.cloudflare.com/ajax/libs/jsforce/1.6.0/jsforce.min.js"]}
 *
 * // index.js
 * import config from './config.json';
 * export {config};
 *
 * @see [github.com/ded/script.js]{@link https://github.com/ded/script.js/}
 */
export function resolveExternal(mod, callback) {
  let deps;
  if (mod.dependencies instanceof Array) {
    deps = mod.dependencies;
  } else if (mod.config != null && mod.config.dependencies instanceof Array) {
    deps = mod.config.dependencies;
  }
  if (deps == null) {
    return callback();
  }
  const len = deps.length;
  const loadScript = (i=0) => {
    $script(deps[i], i);
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

  contextKeys.forEach(key =>
    modules[key.replace(/^\.\//, '').replace(/\.js$/, '')] = context(key)
  );
  return modules;
};
