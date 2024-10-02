import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {
  private baseUrl = environment.apiUrl;

  private empleados: string = `${this.baseUrl}/empleados`

  constructor(
    private http: HttpClient
  ) { }

  listarEmpleados(): Observable<any>{
    return this.http.get(this.empleados)
  }

  obtenerEmpleado(id: number): Observable<any>{
    return this.http.get(`${this.empleados}/${id}`)
  }

  generarEmpleados(request: any): Observable<any>{
    return this.http.post(`${this.empleados}`, request)
  }

  editarEmpleados(request: any, id: number): Observable<any>{
    return this.http.put(`${this.empleados}/${id}`, request)
  }

  eliminarEmpleados(id: number): Observable<any>{
    return this.http.delete(`${this.empleados}/${id}`)
  }

}
