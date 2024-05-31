import { RouterModule, Routes } from "@angular/router";
import { PurchasePartsComponent } from "./purchase-parts/purchase-parts.component";
import { NgModule } from "@angular/core";

const routes: Routes = [
    {
      path: '',
      component: PurchasePartsComponent,
    },
   
  ];
  
  @NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
  })
  export class PurchaseRoutingModule {

  }