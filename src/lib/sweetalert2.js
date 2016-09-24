import _swal from 'sweetalert2';
import * as swaldom from 'sweetalert2/src/utils/dom';
import elementClass from 'element-class';

import './sweetalert2.scss';

const before = (before, fn) => function (...args) {
  before.apply(this, args);
  return fn instanceof Function ? fn.apply(this, args) : undefined;
};

export default function swal(...args) {
  const [options] = args;
  if ((options.extraParams || {}).scrollBody === false) {
    options.onOpen = before(() =>
      elementClass(document.body).add('sw-active')
    , options.onOpen);
    options.onClose = before(() =>
      elementClass(document.body).remove('sw-active')
    , options.onClose);
  }
  return _swal(...args);
}

/*
 * Set 'margin-top'-property on modal based on its computed height
 */
swal.fixVerticalPosition = () => {
  const modal = swaldom.getModal();
  if (modal !== null) {
    modal.style.marginTop = swaldom.getTopMargin(modal);
  }
};

swal.hideButtons = (hidden = true) => {
  swaldom.getConfirmButton().style.display = hidden ? 'none' : 'inline';
  swaldom.getCancelButton().style.display = hidden ? 'none' : 'inline';
};

/**
 * A SweetAlert2 alert dialog
 * @param {string} title - the primary message of the alert
 * @param {string} text - the secondary message of the alert
 * @param {string} [type='error'] - the type of the alert
 */
swal.alert = (title, text, type = 'warning') => {
  return swal({ title, text, type }).done();
};

swal.confirmPdf = ({ saveUrl, pdfUrl }) => {
  const callback = (response) => {
    if (response === true || response === 'cancel') {
      window.open(pdfUrl, 'PDF', 'resizable=true');
      if (response === true) {
        window.sfdcPage.relatedLists.forEach((relatedList) => {
          if (relatedList.title === 'Notes &amp; Attachments') {
            window.sfdcPage.makeRLAjaxRequest(null, relatedList.listId);
          }
        });
      }
    }
  };
  swal({
    text: 'Do you want to save this PDF to Notes & Attachments?',
    type: 'question',
    showCancelButton: true,
    showLoaderOnConfirm: true,
    confirmButtonText: 'Yes',
    cancelButtonText: 'No',
    buttonsStyling: true,
    preConfirm: () => {
      return new Promise((resolve, reject) => {
        const xmlHttp = new XMLHttpRequest();
        xmlHttp.onreadystatechange = () => {
          if (xmlHttp.readyState === 4) {
            if (xmlHttp.status === 200) {
              resolve();
            } else {
              reject('Could not save PDF as an attachment, please contact your system administrator');
            }
          }
        };
        xmlHttp.open('GET', saveUrl, true);
        xmlHttp.send(null);
      });
    },
  }).catch(callback).then(callback);
};
