import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, throwError} from "rxjs";
import {inject, Injectable} from "@angular/core";
import {ApiItem, ApiList, ApiShow} from "@interface/api";
import {ENTRYPOINT} from "@config/entrypoint";

@Injectable({providedIn: 'root'})
export class ApiService {
  baseUrl: string = ENTRYPOINT
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/ld+json',
    })
  }
  public http: HttpClient = inject(HttpClient)

  public add(id: string, data: ApiItem) {
    return this.http
      .post<ApiItem>(
        this.baseUrl + id,
        data,
        this.httpOptions
      )
      .pipe(
        catchError(this.handleError)
      )
  }

  public fetchDataList(id: string): Observable<ApiList> {
    const url = this.baseUrl + id
    return this.http
      .get<ApiList>(url)
      .pipe(
        catchError(this.handleError)
      )
  }

  public fetchData(id: string): Observable<ApiItem> {
    const url = this.baseUrl + id
    return this.http
      .get<ApiItem>(url)
      .pipe(
        catchError(this.handleError)
      )
  }

  public put(id: string, data: ApiItem) {
    return this.http
      .put<ApiShow>(
        this.baseUrl + id,
        data,
        this.httpOptions
      )
      .pipe(
        catchError(this.handleError)
      )
  }


  public delete(id: string | undefined | null) {
    return this.http
      .delete(this.baseUrl + id)
      .pipe(
        catchError(this.handleError)
      )
  }

  private handleError(error: HttpErrorResponse) {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was:`);
    }
    return throwError(() => new Error(error.error));
  }
}
