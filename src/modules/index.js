/**
 * @module
 * @see module:lib/util
 */
import {parseContext} from 'lib/util';
export default parseContext(require.context('./', true, /^(?!.*index).*\.js$/));
