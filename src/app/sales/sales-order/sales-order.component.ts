import { Component, EventEmitter, Output } from '@angular/core';
import { Parts } from '../../models/parts';
import { partsService } from '../../service/partService.service';
import { Subscription } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.css'
})
export class SalesOrderComponent {
  productForm: FormGroup;
  transferredObject: any;
  selectedProducts: any[] = [];
  isSaveDisabled: boolean = false;

  constructor(private formBuilder: FormBuilder, private partService: partsService) {}

  ngOnInit() {
    this.productForm = this.formBuilder.group({
      productTitle: ['']
    });
    this.getObj();
  }

  addProduct() {
    const selectedProduct = this.transferredObject.find(product => product.partTitle  === this.productForm.value.productTitle  );
    if (selectedProduct) {
      const productCopy = { ...selectedProduct,  amount: selectedProduct.partPrice  };
      this.selectedProducts.push(productCopy);
      this.checkPendingInventory();
    }
  }

  updateAmount(product: any, event: Event) {
    const inputElement = event.target as HTMLInputElement;
    const quantity = Number(inputElement.value);
    product.selectedQty = quantity;
    product.amount = product.partPrice * quantity;
    product.pendingInventory = product.qty - quantity;
    this.checkPendingInventory();
  }

  checkPendingInventory() {
    this.isSaveDisabled = this.selectedProducts.some(product => product.pendingInventory < 0);
  }

  saveChanges() {
    this.selectedProducts.forEach(selectedProduct => {
      const product = this.transferredObject.find(p => p.partId === selectedProduct.partId);
      if (product) {
        product.qty -= selectedProduct.selectedQty;
      }
    });
    this.selectedProducts = [];  
    console.log(this.transferredObject);  
  }

  getObj() {
    this.transferredObject = this.partService.getObject();
   
    
  }
}