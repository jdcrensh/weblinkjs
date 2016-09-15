/** @module */
import '../styles/sweetalert2.scss';
import swal from 'sweetalert2';

const dialogs = {
  swal,

  /**
   * A SweetAlert2 alert dialog
   * @param {string} title - the primary message of the alert
   * @param {string} text - the secondary message of the alert
   * @param {string} [type='error'] - the type of the alert
   */
  alert: (title, text, type = 'warning') =>
    swal({ title, text, type }).done(),

  confirmPdf: ({ saveUrl, pdfUrl }) => {
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
  },
};

export default dialogs;
