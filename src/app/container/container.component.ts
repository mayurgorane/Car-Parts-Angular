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
    this.loadPartsFromLocalStorage();
  }

  loadPartsFromLocalStorage() {
    const localData = localStorage.getItem('filteredParts');
    if (localData) {
      console.log('Local storage data found');
      this.filteredParts = JSON.parse(localData);
      this.partService.setPartsArray(this.filteredParts);// Keep service in sync
    } else {
      console.log('No local storage data found, fetching from server');
      this.getAllParts();
     this.filteredParts=  this.partService.getObject();
    }
  }

  getAllParts() {
    this.partService.getAllParts().subscribe({
      next: (response: Parts[]) => {
        response.forEach((element) => {
          if (element.qty == null) {
            element.qty = 0;
          }
        });
        this.filteredParts = response;
        console.log("Get API called");
        localStorage.setItem('filteredParts', JSON.stringify(this.filteredParts));
        this.updatePartsService(); // Update the service with the new array
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
        this.updateLocalStorage(result);
      }
      console.log('The dialog was closed');
    });
    this.updatedPart = part;
  }

  deletePart(deletePartId: number) {
    this.partService.deletePart(deletePartId).subscribe({
      next: () => {
        this.removePartFromLocalData(deletePartId);
      },
      error: (error) => {
        console.error('Error deleting part:', error);
      },
    });
  }

  removePartFromLocalData(deletePartId: number) {
    this.filteredParts = this.filteredParts.filter(part => part.partId !== deletePartId);
    localStorage.setItem('filteredParts', JSON.stringify(this.filteredParts));
    this.updatePartsService(); // Update the service with the new array
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
      this.updateLocalStorage(this.filteredParts); // Send updated quantity to the service and local storage
    }
  }

  getFilterParts(parts: Parts[]) {
    this.filteredParts = parts;
    this.updateLocalStorage(this.filteredParts); // Update the service and local storage with the new array
  }

  updateLocalStorage(parts: Parts[]) {
    this.filteredParts = parts;
    this.updatePartsService(); // Update the service with the new array
    localStorage.setItem('filteredParts', JSON.stringify(this.filteredParts)); // Save to local storage
  }

  updatePart(part: Parts) {
    const existingPart = this.filteredParts.find(p => p.partId === part.partId);
    if (existingPart) {
      this.partService.updatePart(part, existingPart).subscribe({
        next: (response) => {
          console.log('Part updated successfully', response);
          this.updateLocalStorage(this.filteredParts); // Update the service with the new array
        },
        error: (error) => {
          console.error('Error updating part:', error);
        },
      });
    }
  }
}