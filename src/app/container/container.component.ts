import { HttpClient } from '@angular/common/http';
import {Component,OnInit,inject,} from '@angular/core';
import { Parts } from '../models/parts';
import * as companies from '../../assets/company.json';
import { MatDialog } from '@angular/material/dialog';
import { AddPartsComponent } from './add-parts/add-parts.component';
import { partsService } from '../service/partService.service';
 

@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrl: './container.component.css',
})
export class ContainerComponent implements OnInit {
  inventoryPart: Parts;
  partObj1: Parts;
  detailData:Parts;
   newData:Parts;
  quantityData1: Parts;
  data: Parts[] = [];
  filteredParts:Parts[] = [];
 
  addPartFlag: boolean = false;

  partDetailisOpen: boolean = false;

  updatedPart: Parts;
  partId: number;

  http: HttpClient = inject(HttpClient);
  companyData: any = companies;
  showModal: boolean = false;
  formOpen: boolean = false;

  constructor(private partService: partsService, public dialog: MatDialog) {

  }

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

        this.filteredParts = response;
        this.sendObject();
         
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

  openPartDetail(parts:Parts) {
    this.partDetailisOpen = true;
    this.formOpen = false;
    this.detailData = this.filteredParts.find((x)=> x.partId ==parts.partId);
     
  }
  isClose() {
    this.partDetailisOpen = false;
  }

  partObjTransfer(partObjNew: any) {
    this.partObj1 = partObjNew;
  }

  openInventory(partNew: number) {
    this.partDetailisOpen = true;
    this.inventoryPart = this.filteredParts.find((x) => x.partId == partNew);
  }
  isFormOpen(parts:Parts) {
    this.formOpen = true;
     
    this.newData = this.filteredParts.find((x) => x.partId == parts.partId);;
    
  }
  formClose() {
    this.formOpen = false;
  }
  quantityInv(qtyData: Parts) {
    this.filteredParts.find((x) => x.partId == qtyData.partId).qty = qtyData.qty;
  }

  sendObject() {
    
 
    this.partService.setObject(this.filteredParts);
  }

  getFilterParts(parts:Parts[]){
    this.filteredParts= parts;
    console.log(this.filteredParts);
  }

 
}
