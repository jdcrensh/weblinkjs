/** @module */
import sweetAlert from 'sweetalert2';
import 'styles/sweetalert2.scss';

/**
 * A SweetAlert2 alert dialog
 * @param {string} title - the primary message of the alert
 * @param {string} text - the secondary message of the alert
 * @param {string} [type='error'] - the type of the alert
 */
export default (title, text, type='error') =>
  sweetAlert({title, text, type});
