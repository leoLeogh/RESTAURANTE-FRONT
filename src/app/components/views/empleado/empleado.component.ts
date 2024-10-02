import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from 'src/app/services/empleado.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;
declare var $: any;

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {

  listaEmpleados: any[] = [];
  formEmpleado: FormGroup;
  title: string;
  nameBotton: string;
  id: number;

  constructor(private _empleadoService: EmpleadoService) { }

  ngOnInit(): void {
    this.obtenerEmpleados();
    this.initForm();
    this.initDatePicker();
  }

  initDatePicker() {
    const datepicker = (<any>$('#fecha_contratacion')).datepicker({
      format: 'yyyy-mm-dd',
      autoclose: true,
      todayHighlight: true,
      language: 'es'
    });

    datepicker.on('changeDate', (event: any) => {
      this.formEmpleado.controls['fecha_contratacion'].setValue(event.format());
    });
  }

  initForm() {
    this.formEmpleado = new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      apellido: new FormControl(null, [Validators.required]),
      cargo: new FormControl(null, [Validators.required]),
      salario: new FormControl(null, [Validators.required]),
      fecha_contratacion: new FormControl(null, [Validators.required]),
    });
  }

  obtenerEmpleados() {
    this._empleadoService.listarEmpleados().subscribe((data) => {
      this.listaEmpleados = data.empleados;
      if (this.listaEmpleados.length === 0) {
        console.log("Sin registros");
      }
    }, error => {
      console.error('Error al obtener empleados', error);
    });
  }

  obtenerEmpleadoPorId(id: any) {
    this._empleadoService.obtenerEmpleado(id).subscribe((data) => {
      this.formEmpleado.patchValue(data.empleados);
      $('#fecha_contratacion').datepicker('update', data.empleados.fecha_contratacion);
    }, error => {
      console.error('Error al obtener empleado', error);
    });
  }

  eliminarEmpleados(id: any) {
    Swal.fire({
      title: '¿Estás seguro de eliminar el empleado?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this._empleadoService.eliminarEmpleados(id).subscribe(() => {
          this.listaEmpleados = this.listaEmpleados.filter(item => item.id !== id);
          this.alertaExitosa("eliminado");
        }, error => {
          console.error('Error al eliminar empleado', error);
        });
      }
    });
  }

  registrarEmpleado(formulario: any): void {
    this._empleadoService.generarEmpleados(formulario).subscribe(response => {
      this.cerrarModal();
      this.obtenerEmpleados();
      this.resetForm();
      console.log('Empleado registrado', response);
    }, error => {
      console.error("Error al registrar al empleado", error);
    });
  }

  editarEmpleado(id: number, formulario: any): void {
    this._empleadoService.editarEmpleados(id, formulario).subscribe(response => {
      this.cerrarModal();
      this.obtenerEmpleados();
      this.resetForm();
      console.log("Empleado editado", response);
    }, error => {
      console.error("Error al editar empleado", error);
    });
  }

  titulo(titulo: string, id: number) {
    this.title = `${titulo} empleado`;
    this.nameBotton = (titulo === "Crear") ? "Guardar" : "Modificar";
    if (id != null) {
      this.id = id;
      this.obtenerEmpleadoPorId(id);
    }
  }

  crearEditarEmpleado(boton: string) {
    if (boton === "Guardar") {
      this.alertRegistro();
    } else {
      this.alertModificar();
    }
  }

  cerrarModal() {
    const modalElement = document.getElementById('modalEmpleado');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  resetForm(): void {
    this.formEmpleado.reset();
  }

  cerrarBoton() {
    this.resetForm();
    this.cerrarModal();
  }

  alertRegistro() {
    if (this.formEmpleado.valid) {
      Swal.fire({
        title: '¿Estás seguro de registrar al empleado?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.registrarEmpleado(this.formEmpleado.value);
          this.alertaExitosa("registrado");
        }
      });
    }
  }

  alertModificar() {
    if (this.formEmpleado.valid) {
      Swal.fire({
        title: '¿Estás seguro de modificar el registro del empleado?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Sí, modificar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.editarEmpleado(this.id, this.formEmpleado.value);
          this.alertaExitosa("modificado");
        }
      });
    }
  }

  alertaExitosa(accion: string) {
    Swal.fire({
      title: 'Éxito',
      text: `Empleado ${accion} exitosamente!`,
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
  }
}
