import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private baseUrl = environment.apiUrl;

  private reservas: string = `${this.baseUrl}/reservas`

  constructor(
    private http: HttpClient
  ) { }

  listarReservas(): Observable<any>{
    return this.http.get(this.reservas)
  }

  obtenerReservas(id: number): Observable<any>{
    return this.http.get(`${this.reservas}/${id}`)
  }

  generarReservas(request: any): Observable<any>{
    return this.http.post(`${this.reservas}`, request)
  }

  editarReservas(id: number, request: any): Observable<any>{
    return this.http.put(`${this.reservas}/${id}`, request)
  }

  eliminarReservas(id: number): Observable<any>{
    return this.http.delete(`${this.reservas}/${id}`)
  }

}
