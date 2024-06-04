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
  detailData: Parts;
  newData: Parts;
  data: Parts[] = [];
  filteredParts: Parts[] = [];

  addPartFlag: boolean = false;
  partDetailisOpen: boolean = false;
  updatedPart: Parts;
  partId: number;

  http: HttpClient = inject(HttpClient);
  companyData: any = companies;
  showModal: boolean = false;
  formOpen: boolean = false;

  

  constructor(private partService: partsService, public dialog: MatDialog) {}
   
     

  ngOnInit() {
     
    if (this.partService.partObject != null && this.partService.partObject.length == 0) {
      this.getAllParts();
    } else {
      this.filteredParts = this.partService.partObject;
    }
  }

  
  getAllParts() {
    this.partService.getAllParts().subscribe({
      next: (response: any) => {
        response.forEach((element) => {
          if (element.qty == null) {
            element.qty = 0;
          }
        }); 
        if (this.filteredParts.length > 0) {
          const existingPartsMap = new Map(this.filteredParts.map(part => [part.partId, part]));
          response.forEach(newPart => {
            const existingPart = existingPartsMap.get(newPart.partId);
            if (existingPart) {
              newPart.qty = existingPart.qty;  
            } else {
              newPart.qty = 0; 
            }
          });
        }
  
        this.filteredParts = response;
        this.sendObject();
      },
      error: (error) => {
        console.error('Error fetching parts:', error);
      },
    });
  }

  updatePartsService() {
    this.partService.setPartsArray(this.filteredParts);
  }

  openModal(part: Parts) {
    const dialogRef = this.dialog.open(AddPartsComponent, {
      data: part,
    });
  dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        
       }
       this.getAllParts();
      console.log('The dialog was closed');
    });  
  }

  deletePart(deletePartId: number) {
    this.partService.deletePart(deletePartId).subscribe();
    setTimeout(() => {
      this.getAllParts()
     
    }, 50);
    setTimeout(() => {
      alert('Part successfully deleted')
     
    }, 75);
  }
 

  openPartDetail(parts: Parts) {
    this.partDetailisOpen = true;
    this.formOpen = false;
    this.detailData = this.filteredParts.find((x) => x.partId === parts.partId);
  }

  isClose() {
    this.partDetailisOpen = false;
  }

  partObjTransfer(partObjNew: any) {
    this.partObj1 = partObjNew;
  }

  openInventory(partNew: number) {
    this.partDetailisOpen = true;
    this.inventoryPart = this.filteredParts.find((x) => x.partId === partNew);
  }

  isFormOpen(parts: Parts) {
    this.formOpen = true;
    this.newData = this.filteredParts.find((x) => x.partId === parts.partId);
  }

  formClose() {
    this.formOpen = false;
  }

  quantityInv(qtyData: Parts) {
    const part = this.filteredParts.find((x) => x.partId === qtyData.partId);
    if (part) {
      part.qty = qtyData.qty;
    
    }
  }

  getFilterParts(parts: Parts[]) {
    this.filteredParts = parts;
    
  }
 
  onPartAdded(addedPart: Parts) {
    this.filteredParts.push(addedPart);   
    this.updatePartsService(); 
  }
   sendObject() {
  
    this.partService.setPartsArray(this.filteredParts);
  }
}
 