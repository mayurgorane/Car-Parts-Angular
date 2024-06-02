import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesOrderComponent } from './sales-order/sales-order.component';
import { SalesRoutingModule } from './sales-routing.module';
 
import { partsService } from '../service/partService.service';
import { Parts } from '../models/parts';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    SalesOrderComponent 
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    ReactiveFormsModule,
    FormsModule
  ]
})
export class SalesModule { 

  
}
