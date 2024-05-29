import {
  Component,
  EventEmitter,
  Input,
  Output,
  inject,
  input,
} from '@angular/core';
import { partsService } from '../../service/partService.service';
import { Parts } from '../../models/parts';
import { Data } from '@angular/router';

@Component({
  selector: 'app-part-list',
  templateUrl: './part-list.component.html',
  styleUrl: './part-list.component.css',
})
export class PartListComponent {
  @Input() part: Parts;
  
  @Input()quantityData: any;
  
    
   
  isEditEnbale: boolean = false;
  partId: number;
  partObj: Parts;
 
 
   
  constructor(private partServices:partsService) {}

  @Output() partDetailOpen: EventEmitter<any> = new EventEmitter<any>(); 
  @Output() openModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() isEnable: EventEmitter<any> = new EventEmitter<any>();
  @Output() deletePartWithId: EventEmitter<number> = new EventEmitter<number>();
  @Output() partObjTransfer: EventEmitter<Parts> = new EventEmitter<Parts>();
  @Output() openInventoryModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() showForm: EventEmitter<any> = new EventEmitter<any>();

  edit(part: Parts) {
    this.openModal.emit(part);
    this.isEditEnbale = true;
    this.isEnable.emit(this.isEditEnbale);
  
  } 
  deletePart(partId: number) {
    this.deletePartWithId.emit(partId);
  }

  partDetail(partTitle:string){ 
    this.partDetailOpen.emit();
    this.partServices.getPartDetails(partTitle).subscribe((response)=>{
       this.partObj = {...response[0]};
       this.partObjTransfer.emit(this.partObj);
      
    });  
  }

  addInventory(parts:Parts){
    this.openInventoryModal.emit(parts.partId);
  
    this.showForm.emit( );
   
  }

  


}
