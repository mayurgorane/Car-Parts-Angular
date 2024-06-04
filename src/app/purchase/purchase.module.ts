import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurchasePartsComponent } from './purchase-parts/purchase-parts.component';
import { PurchaseRoutingModule } from './purchase-routing-module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    PurchasePartsComponent
  ],
  imports: [
    CommonModule,
     ReactiveFormsModule,
     PurchaseRoutingModule,
     FormsModule

  ]
})
export class PurchaseModule { }
