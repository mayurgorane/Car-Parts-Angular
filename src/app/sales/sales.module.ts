import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { SalesRoutingModule } from './sales-routing.module';
import { SalesInvoiceComponent } from './sales-invoice/sales-invoice.component';
import { partsService } from '../service/partService.service';
import { Parts } from '../models/parts';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SalesOrderComponent,
    SalesInvoiceComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    ReactiveFormsModule
  ]
})
export class SalesModule { 













}
