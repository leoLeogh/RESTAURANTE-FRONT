import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmpleadoService } from 'src/app/services/empleado.service';
import Swal from 'sweetalert2';

declare var bootstrap: any;

@Component({
  selector: 'app-empleado',
  templateUrl: './empleado.component.html',
  styleUrls: ['./empleado.component.css']
})
export class EmpleadoComponent implements OnInit {

  listaEmpleados: any[] = []
  formEmpleado: FormGroup
  title: any
  nameBotton: any
  id: number

  constructor(
    private _empleadoService: EmpleadoService
  ) { }

  ngOnInit(): void {
    this.obtenerEmpleados()
    this.initForm()
  }

  initForm(){
    this.formEmpleado =  new FormGroup({
      nombre: new FormControl(null, [Validators.required]),
      apellidos: new FormControl(null, [Validators.required]),
      cargo: new FormControl(null, [Validators.required]),
      salario: new FormControl(null, [Validators.required]),
      fecha_contratacion: new FormControl(null, [Validators.required]),
    })
  }

  obtenerEmpleados(){
    this._empleadoService.listarEmpleados()
    .subscribe((data)=>{
      this.listaEmpleados = data.empleados;
      console.log(data.empleados)
      if(this.listaEmpleados.length == 0){
        console.log("Sin registros")
      }
    })
  }

  obtenerEmpleadoPorId(id: any) {
    let form = this.formEmpleado
    this._empleadoService.obtenerEmpleado(id)
      .subscribe((data) => {
        form.controls['nombre'].setValue(data.empleados.nombre)
        form.controls['apellidos'].setValue(data.empleados.apellidos)
        form.controls['cargo'].setValue(data.empleados.cargo)
        form.controls['salario'].setValue(data.empleados.salario)
        form.controls['fecha_contratacion'].setValue(data.empleados.fecha_contratacion)
        console.log(data.empleados)
      });
  }

  eliminarEmpleados(id: any){
    Swal.fire({
      title: '¿Estás seguro de eliminar el producto?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed){
        this._empleadoService.eliminarEmpleados(id)
        .subscribe((data)=>{
          console.log("Empleado eliminado", data)
          this.listaEmpleados = this.listaEmpleados.filter(item => item.id !== id);
        }, error => {
          console.error('Error al eliminar al empleado', error);
        });
        this.alertaExitosa("eliminado")
      }
    });
  }

  registrarEmpleado(formulario: any): void{
    if(this.formEmpleado.valid){
      this._empleadoService.generarEmpleados(formulario).subscribe(response =>{
        this.cerrarModal()
        this.obtenerEmpleados()
        
        console.log('Empleado registrado', response);
      }, error =>{
        console.log("Error al registrar al empleado", error)
      });
    }else{

    }
  }

  editarEmpleado(id: number, formulario: any): void{
    if(this.formEmpleado.valid){
      this._empleadoService.editarEmpleados(id, formulario).subscribe(response =>{
        this.cerrarModal()
        this.obtenerEmpleados()
        
        console.log("Datos del empleado editado", response);
      }, error => {
        console.log("Error al editar datos del empleado", error)
      });
    }
  }

  titulo(titulo: any, id: number){
    this.title = `${titulo} empleado`
    titulo == "Crear" ? this.nameBotton = "Guardar" : this.nameBotton = "Modificar"
    if(id != null){
      this.id = id
      this.obtenerEmpleadoPorId(id)
    }
  }
  crearEditarEmpleado(boton: any) {
    if (boton == "Guardar") {
      this.registrarEmpleado(this.formEmpleado.value);
      this.alertRegistro()
    } else {
      this.editarEmpleado(this.id, this.formEmpleado.value);
      this.alertModificar()
    }
  }
/*
  resetForm(): void {
    this.formEmpleado.reset();
    this.formEmpleado.controls['enable'].setValue('S')
  }
  */

  cerrarModal() {
    const modalElement = document.getElementById('modalEmpleado');
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

  cerrarBoton() {
    
    this.cerrarModal()
  }

  alertRegistro() {
    if (this.formEmpleado.valid) {
      Swal.fire({
        title: '¿Estás seguro de registrar al empleado',
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Sí, confirmar',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          this.registrarEmpleado(this.formEmpleado.value)
          this.alertaExitosa("registrado")
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
          this.editarEmpleado(this.id, this.formEmpleado.value)
          this.alertaExitosa("modificado")
        }
      });
    }
  }
  alertaExitosa(titulo: any){
    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Producto "+titulo,
      showConfirmButton: false,
      timer: 1500
    });
  }

}
