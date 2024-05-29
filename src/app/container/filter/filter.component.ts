import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Category } from '../../models/category';
import { Company } from '../../models/company';
import { Model } from '../../models/model';
import { partsService } from '../../service/partService.service';
import { Parts } from '../../models/parts';
import { PartsService } from '../../service/PartsService.service';


@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css'
})
export class FilterComponent {
  filterForm: FormGroup;
  companies: Company[] = [];
  models: Model[] = [];
  categories: Category[] = [];
  parts: Parts[] = [];
  @Output() filteredPartsEvent: EventEmitter<Parts[]> = new EventEmitter<Parts[]>();

  constructor(private formBuilder: FormBuilder, private partsService: PartsService) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCompanies();
    this.loadAllModels();
    this.loadAllCategories();
    
  }

  createForm() {
    this.filterForm = this.formBuilder.group({
      selectedCompanyId: [null],
      selectedModelId: [{ value: null, disabled: false }],
      selectedCategoryId: [{ value: null, disabled: false }]
    });
  }

  

  async loadCompanies() {
    try {
      this.companies = await this.partsService.getAllCompanies().toPromise();
    } catch (error) {
      console.error('Error loading companies', error);
    }
  }

  async loadAllModels() {
    try {
      this.models = await this.partsService.getAllModels().toPromise();
    } catch (error) {
      console.error('Error loading models', error);
    }
  }

  async loadAllCategories() {
    try {
      this.categories = await this.partsService.getAllCategories().toPromise();
    } catch (error) {
      console.error('Error loading categories', error);
    }
  }

  async onCompanyChange() {
    const companyId = this.filterForm.get('selectedCompanyId')?.value;
    if (companyId) {
      await this.loadModels(companyId);
      this.categories = [];
      this.filterForm.get('selectedModelId')?.setValue(null);
      this.filterForm.get('selectedCategoryId')?.setValue(null);
      this.filterForm.get('selectedCategoryId')?.disable();
      this.filterForm.get('selectedModelId')?.enable();
    } else {
      this.filterForm.get('selectedModelId')?.disable();
      this.filterForm.get('selectedCategoryId')?.disable();
    }
  }

  async loadModels(companyId?: number) {
    try {
      if (companyId) {
        this.models = await this.partsService.getCarsByCompany(companyId).toPromise();
      } else {
        this.models = await this.partsService.getAllModels().toPromise();
      }
      this.filterForm.get('selectedModelId')?.enable();
    } catch (error) {
      console.error('Error loading models', error);
    }
  }

  async onModelChange() {
    const companyId = this.filterForm.get('selectedCompanyId')?.value;
    const modelId = this.filterForm.get('selectedModelId')?.value;
    if (companyId && modelId) {
      await this.loadCategories(companyId, modelId); // Pass both companyId and modelId
      this.filterForm.get('selectedCategoryId')?.enable();
    }
  }

  async loadCategories(companyId: number, modelId: number) {
    try {
     
      const categories = await this.partsService.getCategoriesForCar(companyId, modelId).toPromise();
      
      this.categories = categories;
     
      this.filterForm.get('selectedCategoryId')?.enable();
    } catch (error) {
      console.error('Error loading categories', error);
    }
  }
  
  filterParts() {
    const { selectedCompanyId, selectedModelId, selectedCategoryId } = this.filterForm.value;
    this.partsService.filterParts(selectedCompanyId, selectedModelId, selectedCategoryId)
      .subscribe(
        (parts) => {
          this.parts = parts;
          this.filteredPartsEvent.emit(this.parts); 
        },
        (error) => console.error('Error fetching parts', error)
      );
  }
  checkParts(){
    console.log(this.parts);
  }
}