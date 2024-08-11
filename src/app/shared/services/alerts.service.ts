import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  swalWithBootstrapButtons;

  constructor() {
    this.swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton:
          'bg-[#2dd36f] text-white font-bold py-2 px-4 rounded btn ms-1 btn-success',
        cancelButton:
          'bg-transparent hover:bg-[#eb445a] text-[#eb445a] font-semibold hover:text-white py-2 px-4 border border-[#eb445a] hover:border-transparent rounded',
        denyButton: 'btn ms-1 btn-outline-warning',
        htmlContainer: 'swal2-html-container-custom',
      },
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Aceptar',
      reverseButtons: true,
      buttonsStyling: false,
    });
  }

  closeAlert() {
    return Swal.close();
  }

  alertTablet() {
    return Swal.fire({
      imageUrl: './assets/gif/girar-dispositivo.gif',
      allowOutsideClick: false,
      backdrop: 'swal2-backdrop-hide',
      showClass: {
        popup: 'swal2-backdrop-hide',
      },
      background: 'transparent',
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  alertLoading(title = 'Cargando...') {
    return Swal.fire({
      title: `${title}`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }

  alertInfoPedidos(
    title: string,
    text: string,
    html = '',
    showCancelButton = true,
    allowOutsideClick = true,
    cancelButtonText = 'Cancelar',
    confirmButtonText = 'Aceptar'
  ) {
    return this.swalWithBootstrapButtons.fire({
      icon: 'info',
      showCancelButton: showCancelButton,
      title: `${title}`,
      text: `${text}`,
      html: `${html}`,
      showDenyButton: true,
      denyButtonText: `Volver`,
      denyButtonColor: '#F7B320',
      cancelButtonText: `${cancelButtonText}`,
      confirmButtonText: `${confirmButtonText}`,
      allowOutsideClick: allowOutsideClick,
    });
  }
  alertInfo(
    title: string,
    text: string,
    html = '',
    showCancelButton = true,
    allowOutsideClick = true,
    cancelButtonText = 'Cancelar',
    confirmButtonText = 'Aceptar'
  ) {
    return this.swalWithBootstrapButtons.fire({
      icon: 'info',
      showCancelButton: showCancelButton,
      title: `${title}`,
      text: `${text}`,
      html: `${html}`,
      cancelButtonText: `${cancelButtonText}`,
      confirmButtonText: `${confirmButtonText}`,
      allowOutsideClick: allowOutsideClick,
    });
  }

  alertWarning(title: string, text: string, html= "", showCancelButton = true) {
    return this.swalWithBootstrapButtons.fire({
      icon: 'warning',
      showCancelButton: showCancelButton,
      title: `${title}`,
      text: `${text}`,
      html: `${html}`,
    });
  }

  alertConfirm(title: string, text: string, showCancelButton = true) {
    return this.swalWithBootstrapButtons.fire({
      position: 'center-end',
      icon: 'warning',
      showCancelButton: showCancelButton,
      title: `${title}`,
      text: `${text}`,
    });
  }

  alertSuccess(title: string, text: string, showCancelButton = false) {
    return this.swalWithBootstrapButtons.fire({
      icon: 'success',
      showCancelButton: showCancelButton,
      title: `${title}`,
      text: `${text}`,
    });
  }
  alertError(title: string, text: string, showCancelButton = false) {
    return this.swalWithBootstrapButtons.fire({
      icon: 'error',
      showCancelButton: showCancelButton,
      title: `${title}`,
      text: `${text}`,
    });
  }
}
