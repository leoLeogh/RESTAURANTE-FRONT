import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EmpleadoComponent } from './components/views/empleado/empleado.component';
import { ReservaComponent } from './components/views/reserva/reserva.component';

const routes: Routes = [
  {path: 'empleado', component: EmpleadoComponent},
  {path: 'reserva', component: ReservaComponent},
  { path: '', redirectTo: '/empleado', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
