import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ReservaService } from 'src/app/services/reserva.service';

import Swal from 'sweetalert2';

declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css']
})
export class ReservaComponent implements OnInit {

  listaReservas: any[] = [];
  formReserva: FormGroup;
  title: string;
  nameBotton: string;
  id:number;

  constructor( private _reservaService: ReservaService) { }

  ngOnInit(): void {
    this.obtenerReservas();
    this.initForm();
    this.initDatePicker();
  }

  initDatePicker() {
    const datepicker = (<any>$('#fecha')).datepicker({
      format: 'yyyy-mm-dd',
      autoclose: true,
      todayHighlight: true,
      language: 'es'
    });

    datepicker.on('changeDate', (event: any) => {
      this.formReserva.controls['fecha'].setValue(event.format());
    });
  }

  initForm() {
    this.formReserva = new FormGroup({
      nombre_cliente: new FormControl(null, [Validators.required]),
      numero_asientos: new FormControl(null, [Validators.required]),
      fecha: new FormControl(null, [Validators.required]),
    });
  }

  obtenerReservas() {
    this._reservaService.listarReservas().subscribe((data) => {
      this.listaReservas = data.reservas;
      if (this.listaReservas.length === 0) {
        console.log("Sin registros");
      }
    }, error => {
      console.error('Error al obtener las reservas', error);
    });
  }

  obtenerReservaPorId(id: any) {
    this._reservaService.obtenerReservas(id).subscribe((data) => {
      console.log('Datos de la reserva:', data);
      this.formReserva.patchValue(data.reserva);
      $('#fecha').datepicker('update', data.reserva.fecha);
    }, error => {
      console.error('Error al obtener la resrva', error);
    });
  }

  eliminarReservas(id: any) {
    Swal.fire({
      title: '¿Estás seguro de eliminar esta reserva?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._reservaService.eliminarReservas(id).subscribe(() => {
          this.listaReservas = this.listaReservas.filter(item => item.id !== id);
          this.alertaExitosa("eliminado");
        }, error => {
          console.error('Error al eliminar reserva', error);
        });
      }
    });
  }

  registrarReserva(formulario: any): void {
    this._reservaService.generarReservas(formulario).subscribe(response => {
      this.cerrarModal();
      this.obtenerReservas();
      this.resetForm();
      console.log('Reserva registrada', response);
    }, error => {
      console.error("Error al registrar reserva", error);
    });
  }

  editarReserva(id: number, formulario: any): void {
    this._reservaService.editarReservas(id, formulario).subscribe(response => {
      this.cerrarModal();
      this.obtenerReservas();
      this.resetForm();
      console.log("Reserva editada", response);
    }, error => {
      console.error("Error al editar reserva", error);
    });
  }

  titulo(titulo: string, id: number) {
    this.title = `${titulo} reserva`;
    this.nameBotton = (titulo === "Crear") ? "Guardar" : "Modificar";
    if (id != null) {
      this.id = id;
      this.obtenerReservaPorId(id);
    }
  }

  crearEditarReserva(boton: string) {
    if (boton === "Guardar") {
      this.alertRegistro();
    } else {
      this.alertModificar();
    }
  }

  cerrarModal() {
    const modalElement = document.getElementById('modalReserva');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  resetForm(): void {
    this.formReserva.reset();
  }

  cerrarBoton() {
    this.resetForm();
    this.cerrarModal();
  }

  alertRegistro() {
    if (this.formReserva.valid) {
      Swal.fire({
        title: '¿Estás seguro de registrar esta reserva?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.registrarReserva(this.formReserva.value);
          this.alertaExitosa("registrado");
        }
      });
    }
  }

  alertModificar() {
    if (this.formReserva.valid) {
      Swal.fire({
        title: '¿Estás seguro de modificar el registro de esta reserva?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, modificar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.editarReserva(this.id, this.formReserva.value);
          this.alertaExitosa("modificado");
        }
      });
    }
  }

  alertaExitosa(accion: string) {
    Swal.fire({
      title: 'Éxito',
      text: `Reserva ${accion} exitosamente!`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }

}
