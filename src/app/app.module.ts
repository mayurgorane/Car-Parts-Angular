import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
 
import { PartListComponent } from './container/part-list/part-list.component';
import { HttpClientModule } from '@angular/common/http';
import { FilterComponent } from './container/filter/filter.component';
 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { AddPartsComponent } from './container/add-parts/add-parts.component';
import { MatDialogModule } from '@angular/material/dialog';
 
import { ContainerComponent } from './container/container.component';
import { NavbarComponent } from './navbar/navbar.component';
import { PartDetailComponent } from './container/part-detail/part-detail.component';
 

@NgModule({
  declarations: [
    AppComponent,
     NavbarComponent,
    ContainerComponent,
    PartListComponent,
    FilterComponent,
    AddPartsComponent,
    PartDetailComponent 
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MatDialogModule,ReactiveFormsModule
  ],
  
  providers: [
  
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
