import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesOrderComponent } from './sales-order/sales-order.component';
 

const routes: Routes = [
  {
    path: 'sales',
    component: SalesOrderComponent,
  },
 
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
