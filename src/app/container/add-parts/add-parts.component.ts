import {
  Component,
  Inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Category } from '../../models/category';
import { Company } from '../../models/company';
import { Model } from '../../models/model';
import { PartDto } from '../../models/partDto';
import { partsService } from '../../service/partService.service';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Parts } from '../../models/parts';

@Component({
  selector: 'app-add-parts',
  templateUrl: './add-parts.component.html',
  styleUrl: './add-parts.component.css',
})
export class AddPartsComponent implements OnInit {
 
 
  
  @Input() updatepart: Parts;

  partForm: FormGroup;
  companies: Company[] = [];
  models: Model[] = [];
  categories: Category[] = [];

  constructor(
    private formBuilder: FormBuilder, private partService: partsService,
    private dialogRef: MatDialogRef<AddPartsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Parts ) {
    this.createForm();
  }

  ngOnInit(): void {
    this.loadCompanies().then(() => {
      if (this.data) {
        this.setFormValues();
      }
    });
  }

  createForm() {
    this.partForm = this.formBuilder.group({
      selectedCompanyId: [null, Validators.required],
      selectedModelId: [{ value: null, disabled: true }, Validators.required],
      selectedCategoryId: [{ value: null, disabled: true }, Validators.required],
      partTitle: ['', Validators.required],
      partPrice: [null, [Validators.required, Validators.min(0)]]
    });
  }

  async loadCompanies() {
    try {
      this.companies = await this.partService.getAllCompanies().toPromise();
    } catch (error) {
      console.error('Error loading companies', error);
    }
  }

  async onCompanyChange() {
    const companyId = this.partForm.get('selectedCompanyId')?.value;
    if (companyId) {
      await this.loadModels(companyId);
      this.categories = [];
      this.partForm.get('selectedModelId')?.setValue(null);
      this.partForm.get('selectedCategoryId')?.setValue(null);
      this.partForm.get('selectedCategoryId')?.disable();
    }
  }

  async loadModels(companyId: number) {
    try {
      this.models = await this.partService.getCarsByCompany(companyId).toPromise();
      this.partForm.get('selectedModelId')?.enable();
    } catch (error) {
      console.error('Error loading models', error);
    }
  }

  async onModelChange() {
    const companyId = this.partForm.get('selectedCompanyId')?.value;
    const modelId = this.partForm.get('selectedModelId')?.value;
    if (companyId && modelId) {
      await this.loadCategories(companyId, modelId);
      this.partForm.get('selectedCategoryId')?.setValue(null);
    }
  }

  async loadCategories(companyId: number, modelId: number) {
    try {
      this.categories = await this.partService.getCategoriesForCar(companyId, modelId).toPromise();
      this.partForm.get('selectedCategoryId')?.enable();
    } catch (error) {
      console.error('Error loading categories', error);
    }
  }

  async setFormValues() {
    const company = this.companies.find(c => c.name === this.data.companyName);
    if (company) {
      this.partForm.patchValue({ selectedCompanyId: company.id });
      await this.loadModels(company.id);
      const model = this.models.find(m => m.modelname === this.data.modelName);
      if (model) {
        this.partForm.patchValue({ selectedModelId: model.modelId });
        await this.loadCategories(company.id, model.modelId);
        const category = this.categories.find(c => c.categoryName === this.data.categoryName);
        if (category) {
          this.partForm.patchValue({ selectedCategoryId: category.categoryId });
        }
      }
    }

    this.partForm.patchValue({
      partTitle: this.data.partTitle,
      partPrice: this.data.partPrice
    });
  }

  

  closeDialog() {
    this.dialogRef.close();
  }


  addPart() {
    if (this.partForm.valid) {
      const { selectedCompanyId, selectedModelId, selectedCategoryId, partTitle, partPrice } = this.partForm.value;
      const partDto = { partTitle, partPrice };
     
      if (this.data) {
      this.partService.updatePart(this.partForm.value,this.data).subscribe(
          response => {
            console.log('Part successfully updated', response);
            this.closeDialog();
            
          },
          error => console.error('There was an error updating part!', error)
        );
      } else {
        this.partService.addPart(selectedCompanyId, selectedModelId, selectedCategoryId, partDto).subscribe(
           response => {
            this.closeDialog(); 
            console.log('Part successfully added', response);
            
          
          },
          error => {console.error('There was an error adding part!', error)
          this.closeDialog();
          }
        );
      } 
      
    }
  }
 
  
}

