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

@Component({
  selector: 'app-part-list',
  templateUrl: './part-list.component.html',
  styleUrl: './part-list.component.css',
})
export class PartListComponent {
  @Input() part: Parts;

  isEditEnbale: boolean = false;
  partId: number;
  constructor(private partServices:partsService) {}

  @Output() openModal: EventEmitter<any> = new EventEmitter<any>();
  @Output() isEnable: EventEmitter<any> = new EventEmitter<any>();

  edit(part: Parts) {
    this.openModal.emit(part);
    this.isEditEnbale = true;
    this.isEnable.emit(this.isEditEnbale);
   
    
  
  }

  @Output() deletePartWithId: EventEmitter<number> = new EventEmitter<number>();

  deletePart(partId: number) {
    this.deletePartWithId.emit(partId);
  }
}
