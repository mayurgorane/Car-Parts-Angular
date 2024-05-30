import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { partsService } from '../../service/partService.service';
import { Parts } from '../../models/parts';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PartListComponent } from '../part-list/part-list.component';

@Component({
  selector: 'app-part-detail',
  templateUrl: './part-detail.component.html',
  styleUrl: './part-detail.component.css'
})
export class PartDetailComponent implements OnInit {
 
 
 constructor(private partService: partsService ){
    
 }
 
  
 @Input()Data:Parts;
 @Input()partObj: Parts;
@Input()isFormOpen:boolean;
 ngOnInit(){
       
 }

  @Output() isCloseButton: EventEmitter<any>= new EventEmitter<any>();
  @Output() isFormClose: EventEmitter<any>= new EventEmitter<any>(); 
  @Output() qtyData: EventEmitter<any>= new EventEmitter<any>(); 
 
close(){
  
  this.isCloseButton.emit();
  
}

formClose(){
  this.isFormClose.emit();
  this.isCloseButton.emit();
}

decreaseQty() {
  if (this.Data.qty > 0) {
    this.Data.qty--;
  }
}

increaseQty() {
  this.Data.qty++;
}

getData(){
 
 this.isCloseButton.emit(); 
 this.qtyData.emit(this.Data);

}


 

}
