import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Parts } from '../../models/parts';
import { partsService } from '../../service/partService.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { arrayBuffer } from 'node:stream/consumers';
import { time } from 'node:console';
interface Parts1 {
  partId: number;
  partTitle: string;
  partPrice: number;
  modelName: string;
  qty: number;
}
@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.css'
})
export class SalesOrderComponent {
  transferredObject: Parts[] = [];
  partsInventory
  products: Parts[] = [];
  
  inputQty:number;
inputQuantity: any;

  constructor(private partService: partsService) {}

  ngOnInit() {
    this.getObj();
    this.addRow();
  }

  getObj() {
    this.partsInventory=new Map()
    this.transferredObject = this.partService.getObject();
    this.transferredObject.map(
      (obj:any)=>{
       if(obj.qty){
        this.partsInventory.set(obj.partId,obj.qty)
       }else{
        this.partsInventory.set(obj.partId,0)
       }
      }
    )
    console.log(this.transferredObject);
  }

  addRow() {
    const newProduct: Parts = {
      partId: null,
      partTitle: '',
      partPrice: 0,
      modelName: '',
      qty: 0,
      companyName: '',
      categoryName:''
    };
    this.products.push(newProduct);
  }

  onProductSelect(product: Parts, partId: number) {
    const selectedProduct = this.transferredObject.find(p => p.partId == Number(partId));
    if (selectedProduct) {
      product.partId = partId;
      product.partTitle = selectedProduct.partTitle;
      product.partPrice = selectedProduct.partPrice;
      product.modelName = selectedProduct.modelName;
      //product.qty = selectedProduct.qty;
      product.companyName = selectedProduct.companyName;
 
    }
    
       
        
  }

  onQuantityChange(product: Parts, quantity: number) {
    if (quantity >= 0) {
      const selectedProduct = this.transferredObject.find(p => p.partId === product.partId);
      selectedProduct.qty = quantity;
      product.partPrice = selectedProduct.partPrice;

    }

  }

  


quanityChangeNew(inputQuanity: any ,product:Parts){
  console.log(inputQuanity)
  const productId = Number(product.partId);
  const selectedProduct = this.transferredObject.find(p => p.partId == productId);
  console.log(selectedProduct)
  if(selectedProduct.qty && inputQuanity){
   selectedProduct.qty = selectedProduct.qty - inputQuanity
   product.qty+=inputQuanity

  this.partsInventory.set(selectedProduct.partId,selectedProduct.qty)
  console.log(this.partsInventory);
  }
}
getRemainingInventryData(partId) {
  return this.partsInventory.get(Number(partId))
}
}