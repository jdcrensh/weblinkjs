/**
 * Main entry point
 * @module weblinks
 */
import 'babel-polyfill';
import modules from 'modules';
import {resolveExternal} from 'lib/util';
import _ from './lib/lodash';

/**
 * Invoke a named module
 * @example <caption>Invoke module via the weblink's javascript</caption>
 * {!REQUIRESCRIPT('/resource/weblinkjs/weblinks.js')}
 * weblinks.invoke('some_module_name', params);
 * @param {string} name - relative path to the module under `src/modules`
 * @param {Object} [params={}] - named parameters to pass through to the module
 */
export function invoke(name, params={}) {
  if (typeof name !== 'string') {
    throw new Error('first param to invoke() must be a string');
  }
  const mod = _.get(modules, name.replace('/', '.'));
  if (mod == null) {
    throw new Error(`module '${name}' does not exist`);
  }
  resolveExternal(mod, () => mod.exec(params));
};
