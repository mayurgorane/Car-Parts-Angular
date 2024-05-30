import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { SalesInvoiceComponent } from './sales-invoice/sales-invoice.component';

const routes: Routes = [
  {
    path: '',
    component: SalesOrderComponent,
  },
  {
    path: 'invoice',
    component: SalesInvoiceComponent,
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
