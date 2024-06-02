import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Parts } from '../../models/parts';
import { partsService } from '../../service/partService.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { arrayBuffer } from 'node:stream/consumers';
import { time } from 'node:console';
interface PartsObj {
  partId: number;
  partTitle: string;
  partPrice: number;
  companyName: string;
  modelName: string;
  qty: number;
  categoryName:string;
  inputQuantity:number
}
@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.css'
})
export class SalesOrderComponent {
  transferredObject: Parts[] = [];
  partsInventory: Map<number, number>;
  products: PartsObj[] = [];

  constructor(private partService: partsService) {}

  ngOnInit() {
    this.getObj();
    this.addRow();
  }

  getObj() {
    this.partsInventory = new Map();
    this.transferredObject = this.partService.getObject();
    this.transferredObject.forEach(obj => {
      this.partsInventory.set(obj.partId, obj.qty || 0);
    });
    console.log(this.transferredObject);
  }

  addRow() {
    const newProduct: PartsObj = {
      partId: null,
      partTitle: '',
      partPrice: 0,
      modelName: '',
      qty: 0,
      companyName: '',
      categoryName: '',
      inputQuantity: 0
    };
    this.products.push(newProduct);
  }

  onProductSelect(product: Parts, partId: number) {
    const selectedProduct = this.transferredObject.find(p => p.partId === Number(partId));
    if (selectedProduct) {
      product.partId = partId;
      product.partTitle = selectedProduct.partTitle;
      product.partPrice = selectedProduct.partPrice;
      product.modelName = selectedProduct.modelName;
      product.companyName = selectedProduct.companyName;
    }
  }

  quantityChangeNew(inputQuantity: any, product: Parts) {
    console.log(inputQuantity);
    const productId = Number(product.partId);
    const selectedProduct = this.transferredObject.find(p => p.partId === productId);
    console.log(selectedProduct);
    if (selectedProduct.qty && inputQuantity) {
      selectedProduct.qty = selectedProduct.qty - inputQuantity;
      product.qty += inputQuantity;
      this.partsInventory.set(selectedProduct.partId, selectedProduct.qty);
      console.log(this.partsInventory);
    }
  }

  getRemainingInventoryData(partId: number) {
    return this.partsInventory.get(Number(partId));
  }

saveProducts() {
  this.products.forEach(product => {
    const transferredProduct = this.transferredObject.find(p => p.partId === product.partId);
    if (transferredProduct) {
      transferredProduct.qty += product.qty; // Update qty of transferredObject
    }
  });
  console.log('Saved Products:', this.transferredObject);
}

  removeRow(index: number) {
    this.products.splice(index, 1);
  }
  getTotalAmount(): number {
    return this.products.reduce((total, product) => total + (product.qty * product.partPrice), 0);
  }
}