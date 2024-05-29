import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";

 
import { Observable, catchError, throwError } from "rxjs";
import { Category } from "../models/category";
import { Company } from "../models/company";
import { Model } from "../models/model";
import { PartDto } from "../models/partDto";
import { Parts } from "../models/parts";
import { consumerPollProducersForChange } from "@angular/core/primitives/signals";
@Injectable({
    providedIn: 'root'
  })
  export class partsService {
  
    private apiUrl = 'http://localhost:9090';

    
  
    constructor(private http: HttpClient) { }
  
    getAllCompanies(): Observable<Company[]> {
      return this.http.get<Company[]>(`${this.apiUrl}/companies`).pipe(catchError(this.handleError));
    }
  
    getCarsByCompany(companyId: number): Observable<Model[]> {
      return this.http.get<Model[]>(`${this.apiUrl}/companies/${companyId}/models`).pipe(catchError(this.handleError));
    }
  
    getCategoriesForCar(companyId: number, modelId: number): Observable<Category[]> {
      return this.http.get<Category[]>(`${this.apiUrl}/companies/${companyId}/models/${modelId}/categories`).pipe(catchError(this.handleError));
    }
  
    addPart(companyId: number, modelId: number, categoryId: number, partDto: PartDto): Observable<any> {
      const url = `${this.apiUrl}/companies/${companyId}/cars/${modelId}/categories/${categoryId}/parts`;
      const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
      return this.http.post(url, partDto, { headers: headers }).pipe(catchError(this.handleError));
    }

    deletePart(partId: number): Observable<void> {
      return this.http.delete<any>(`http://localhost:9090/filterParts/${partId}`);

    }
    updatePart(data: Parts,value:Parts): Observable<any> {
       let data1={
        partTitle:data.partTitle,
        partPrice: data.partPrice
        
      }
        console.log(data);
      const url = `http://localhost:9090/filterParts/${value.partId}`;
      return this.http.put(url,data1  , { responseType: 'text' });
    }
     
    getPartDetails(partTitle:string ): Observable<Parts> {
      return this.http.get<Parts>(`http://localhost:9090/filterParts?partTitle=${partTitle} `);
    }






    private handleError(error: HttpErrorResponse) {
      let errorMessage = 'Unknown error!';
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
      return throwError(errorMessage);
    }
//ex


 
  }