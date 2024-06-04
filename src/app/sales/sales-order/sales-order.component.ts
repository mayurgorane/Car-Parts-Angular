import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { Parts } from '../../models/parts';
import { partsService } from '../../service/partService.service';
import { Subscription, map } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { arrayBuffer } from 'node:stream/consumers';
import { time } from 'node:console';
import { Router } from '@angular/router';
interface PartsObj {
  partId: number;
  partTitle: string;
  partPrice: number;
  companyName: string;
  modelName: string;
  qty: number;
  categoryName: string;
  inputQuantity: number;
}
@Component({
  selector: 'app-sales-order',
  templateUrl: './sales-order.component.html',
  styleUrl: './sales-order.component.css',
})
export class SalesOrderComponent {
  transferredObject: Parts[] = [];
  partsInventory: Map<number, number>;
  products: PartsObj[] = [];
  isDisable: boolean = false;
  isDisablePart: boolean;
  availableParts: Parts[];
 

  constructor(private partService: partsService, private router: Router) {
    this.isDisablePart = false;
  }

  ngOnInit() {
    this.getObj();
    this.addRow();
  }

  getObj() {
    this.partsInventory = new Map();
    this.transferredObject = JSON.parse(
      JSON.stringify(this.partService.getObject())
    );
    this.transferredObject.forEach((obj) => {
      this.partsInventory.set(obj.partId, obj.qty || 0);
    });
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
      inputQuantity: 0,
    };
     
    this.products.push(newProduct);
  }

  onProductSelect(product: PartsObj, partId: number) {
 
    if (this.products.filter((x) => x.partId == product.partId).length > 1) {
      product = {
        partId: null,
        partTitle: '',
        partPrice: 0,
        modelName: '',
        qty: 0,
        companyName: '',
        categoryName: '',
        inputQuantity: 0,
      };
           this.products[ partId] = product;
         return  alert('Item already added');;
    }
    const selectedProduct = this.transferredObject.find(
      (p) => p.partId === Number(partId)
    );
    if (selectedProduct) {
      product.partId = partId;
      product.partTitle = selectedProduct.partTitle;
      product.partPrice = selectedProduct.partPrice;
      product.modelName = selectedProduct.modelName;
      product.companyName = selectedProduct.companyName;
      product.qty = selectedProduct.qty;
    } 
    product.inputQuantity = product.partId ? product.inputQuantity : 0;  
    this.isRowDisabled(product);
  }

  saveProducts() {
    this.isDisablePart = false;

    this.products.forEach((element) => {
      const selectedProduct = this.transferredObject.find(
        (x) => x.partId == element.partId
      );
      if (selectedProduct && element.inputQuantity > selectedProduct.qty) {
        this.isDisablePart = true;
      }

      if (selectedProduct) {
        selectedProduct.qty = element.qty - element.inputQuantity;
      }
    });

    if (!this.isDisablePart) {
      this.partService.setPartsArray(this.transferredObject);
      this.router.navigate(['/']);
    }
  }

  removeRow(index: number) {
    this.products.splice(index, 1);
  }

  getTotalAmount(): number {
    return this.products.reduce(
      (total, product) => total + product.inputQuantity * product.partPrice,
      0
    );
  }

  navigateIfNotDisabled() {
    if (!this.isDisablePart) {
      this.isDisablePart = false;
      this.router.navigate(['/']);
    }
  }

  allRowsSelected(): boolean {
    return this.products.every((product) => product.partId !== null);
  }

  onInputChange(product: PartsObj) {
    if (product.inputQuantity <= 0) {
      product.inputQuantity = 0;
   
    }
    if(product.inputQuantity < 0){
      return alert("Parts should be greater than zero");
    }

    this.isRowDisabled(product);  
  }

  isSaveEnabled(): boolean {
    return this.products.every(
      (product) => product.partId !== null && product.inputQuantity !== 0
    );
  }

  

  isRowDisabled(product: PartsObj): boolean {
    return product.partId === null;
  }
  availableParts1(){
    this.availableParts = this.transferredObject.filter((m)=>  m.qty > 0)
    return this.availableParts;
  
  }
}
