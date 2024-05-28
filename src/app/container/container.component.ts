import { HttpClient } from '@angular/common/http';
import { Component, Output, inject } from '@angular/core';
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
export class ContainerComponent {
  data: Parts[] = [];
   addPartFlag: boolean = false;

  updatedPart: Parts;
   partId:number

  http: HttpClient = inject(HttpClient);
  companyData: any = companies;
  showModal: boolean = false;

  constructor(private partService: partsService ,public dialog: MatDialog){}

  ngOnInit() {
    this.getAllParts() ;
   
  }

  getAllParts() {
    this.http.get('http://localhost:9090/filterParts').subscribe({
      next: (response: any) => {        
        this.data = response;
      },
      error: (error) => {
        console.error('Error fetching parts:', error);
      },
    });
  }

  
  openModal(part: Parts) {
    const dialogRef = this.dialog.open(AddPartsComponent, {
      data: part  
    });
    
    
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
    this.updatedPart=part;
   
    
  }

  deletePart(deletePartId:number){
    this.partService.deletePart(deletePartId).subscribe();
  }

 
   
  }

 
 