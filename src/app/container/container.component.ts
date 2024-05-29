import { HttpClient } from '@angular/common/http';
import { Component, Output, inject } from '@angular/core';
import { Parts } from '../models/parts';
import * as companies from '../../assets/company.json';
import { MatDialog } from '@angular/material/dialog';
import { AddPartsComponent } from './add-parts/add-parts.component';
import { partsService } from '../service/partService.service';
import { map } from 'rxjs';
import { PartDetailComponent } from './part-detail/part-detail.component';

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrl: './container.component.css',
})
export class ContainerComponent {
  inventoryPart: Parts;

  quantityData1: Parts;
  data: Parts[] = [];
  addPartFlag: boolean = false;
  
  filterPart: Parts[] = [];
  partDetailisOpen: boolean = false;
  partObj1: Parts;
  updatedPart: Parts;
  partId: number;

  http: HttpClient = inject(HttpClient);
  companyData: any = companies;
  showModal: boolean = false;
  formOpen: boolean = false;

  constructor(private partService: partsService, public dialog: MatDialog) {}

  ngOnInit() {
    this.getAllParts();
  }

  getAllParts() {
    this.http.get('http://localhost:9090/filterParts').subscribe({
      next: (response: any) => {
        response.forEach((element) => {
          if (element.qty == null) {
            element.qty = 0;
          }
        });

        this.filterPart = response;
      },
      error: (error) => {
        console.error('Error fetching parts:', error);
      },
    });
  }

  openModal(part: Parts) {
    const dialogRef = this.dialog.open(AddPartsComponent, {
      data: part,
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.getAllParts();
      console.log('The dialog was closed');
    });
    this.updatedPart = part;
  }

  deletePart(deletePartId: number) {
    this.partService.deletePart(deletePartId).subscribe();
    setTimeout(() => {
      this.getAllParts();
    }, 1000);
  }

  openPartDetail() {
    this.partDetailisOpen = true;
    this.formOpen = false;
  }
  isClose() {
    this.partDetailisOpen = false;
  }

  partObjTransfer(partObjNew: any) {
    this.partObj1 = partObjNew;
  }

  openInventory(partNew: number) {
    this.partDetailisOpen = true;
    this.inventoryPart = JSON.parse(
      JSON.stringify(this.filterPart.find((x) => x.partId == partNew))
    );
  }
  isFormOpen() {
    this.formOpen = true;
    console.log(this.formOpen);
  }
  formClose() {
    this.formOpen = false;
  }
  quantityInv(qtyData: Parts) {
 
    this.filterPart.find((x) => x.partId == qtyData.partId).qty = qtyData.qty;
    console.log(this.filterPart);
  }


  filterPartEvent(partsArray:Parts[] ){
    this.filterPart=partsArray;
    console.log(this.filterPart);
  }


  
}
