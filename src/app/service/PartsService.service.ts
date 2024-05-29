import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, throwError } from "rxjs";
import { Category } from "../models/category";
import { Company } from "../models/company";
import { Model } from "../models/model";
import { Parts } from "../models/parts";

@Injectable({
    providedIn: 'root'
  })
  export class PartsService {
    private apiUrl = 'http://localhost:9090';

    constructor(private http: HttpClient) { }
  
    getAllCompanies(): Observable<Company[]> {
      return this.http.get<Company[]>(`${this.apiUrl}/companies`);
    }
  
    getCarsByCompany(companyId: number): Observable<Model[]> {
      return this.http.get<Model[]>(`${this.apiUrl}/companies/${companyId}/models`);
    }
  
    getAllModels(): Observable<Model[]> {
        return this.http.get<Model[]>(`${this.apiUrl}/models`);
      }
    getCategoriesForCar(companyId: number, modelId: number): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/companies/${companyId}/models/${modelId}/categories`).pipe(
          catchError(this.handleError)
        );
      }
      getAllCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(`${this.apiUrl}/category`);
      }

      filterParts(companyId?: number, modelId?: number, categoryId?: number): Observable<Parts[]> {
        let params: any = {};
        if (companyId) params.companyId = companyId;
        if (modelId) params.modelId = modelId;
        if (categoryId) params.categoryId = categoryId;
        return this.http.get<Parts[]>(`${this.apiUrl}/filterParts`, { params });
      }


      getParts(companyId?: number, modelId?: number, categoryId?: number): Observable<Parts[]> {
        let params: any = {};
        if (companyId) params.companyId = companyId;
        if (modelId) params.modelId = modelId;
        if (categoryId) params.categoryId = categoryId;
        return this.http.get<Parts[]>(`${this.apiUrl}/filterParts`, { params }).pipe(
          catchError(this.handleError)
        );
      }


      private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
        
          errorMessage = `Error: ${error.error.message}`;
        } else {
      
          errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        console.error(errorMessage);
        return throwError(errorMessage);
      }
   
  
  
  
  }