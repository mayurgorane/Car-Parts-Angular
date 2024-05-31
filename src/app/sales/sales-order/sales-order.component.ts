import { Component, EventEmitter, Output } from '@angular/core';
import { Parts } from '../../models/parts';
import { partsService } from '../../service/partService.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { arrayBuffer } from 'node:stream/consumers';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.css'
})
export class SalesOrderComponent {
  availableProducts: any[] = [];
  productForm: FormGroup;
  transferredObject: any[] = [];
  selectedProducts: any[] = [];
  isSaveDisabled: boolean = false;
  isSaveDisabled1: boolean = false;

  constructor(private formBuilder: FormBuilder, private partService: partsService) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      productTitle: ['']
    });
    this.getObj();
    this.isSaveDisabled1 = this.availableProducts.length === 0;
  }

  addProduct() {
    const selectedProduct = this.transferredObject.find(product => product.partId === +this.productForm.value.productTitle);
    if (selectedProduct) {
      const productCopy = { 
        ...selectedProduct, 
        selectedQty: 1, 
        amount: selectedProduct.partPrice
      };
      this.selectedProducts.push(productCopy);
      this.checkPendingInventory();
      this.updateAvailableProducts();
    }
  }

  updateAmount(product: any, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const quantity = Number(inputElement.value);
    product.selectedQty = quantity;
    product.amount = product.partPrice * quantity;
    this.checkPendingInventory();
  }
  checkPendingInventory() {
    this.isSaveDisabled = this.selectedProducts.some(product => product.qty < product.selectedQty);
  }

  saveChanges() {
    this.selectedProducts.forEach(selectedProduct => {
      const product = this.transferredObject.find(p => p.partId === selectedProduct.partId);
      if (product) {
        product.qty -= selectedProduct.selectedQty;
      }
    });
    this.selectedProducts = [];
    this.updateAvailableProducts();
  }

  getObj() {
    this.transferredObject = this.partService.getObject();
    this.updateAvailableProducts();
  }

  removeProduct(index: number) {
    const removedProduct = this.selectedProducts.splice(index, 1)[0];
    if (removedProduct) {
      const product = this.transferredObject.find(p => p.partId === removedProduct.partId);
      if (product) {
        product.qty += removedProduct.selectedQty;
      }
    }
    this.checkPendingInventory();
    this.updateAvailableProducts();
  }
  updateAvailableProducts() {
    if (this.transferredObject) {
      this.availableProducts = this.transferredObject.filter(product => product.qty > 0);
    }
  }

  getTotalAmount(): number {
    return this.selectedProducts.reduce((total, product) => total + product.amount, 0);
  }
}
  
 
 