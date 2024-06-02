import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Parts } from '../../models/parts';
import { partsService } from '../../service/partService.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { arrayBuffer } from 'node:stream/consumers';
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
  products: Parts[] = [];
  
  inputQty:number;
inputQuantity: any;

  constructor(private partService: partsService) {}

  ngOnInit() {
    this.getObj();
    this.addRow();
  }

  getObj() {
    this.transferredObject = this.partService.getObject();
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
      product.qty = selectedProduct.qty;
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

  getPendingInventoryQuantity(id:number){
    if(id){
      const productId = id;
      const selectedProduct = this.transferredObject.find(p => p.partId === id);
  
         //      selectedProduct.qty ? : return selectedProduct.qty : 0;
         return selectedProduct.qty
   
    }
    return 0;
    
 
}

quanityChangeNew(inputQuanity: any ,product:Parts){
  const productId = product.partId;
  const selectedProduct = this.transferredObject.find(p => p.partId === product.partId);
  selectedProduct.qty = selectedProduct.qty - product.qty
  this.getPendingInventoryQuantity(product.partId);
  console.log(selectedProduct.partId);
}
}