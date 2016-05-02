/** @module */
import sweetAlert from 'sweetalert2';
import 'styles/sweetalert2.scss';

/**
 * A SweetAlert2 confirmation dialog
 * @param {string} text
 */
export default (text, callback) =>
  sweetAlert({
    text: text,
    type: 'question',
    showCancelButton: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    buttonsStyling: true,
    closeOnConfirm: true,
    closeOnCancel: true
  }).then(callback);
