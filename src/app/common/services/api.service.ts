import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private http=inject(HttpClient);

  get<T>(url: string, params?: any, options?: { headers?: any }): Observable<T> {
  return this.http.get<T>(url, {
    params: this.buildHttpParams(params),
    ...options
  });
}


  post<T>(url: string, body: any): Observable<T> {
    return this.http.post<T>(url, body);
  }

  postForm<T>(url: string, formData: FormData): Observable<T> {
    return this.http.post<T>(url, formData);
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.http.put<T>(url, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }

  private buildHttpParams(params?: any): HttpParams {
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach(key => {
        const value = params[key];
        if (value !== null && value !== undefined) {
          httpParams = httpParams.set(key, value);
        }
      });
    }
    return httpParams;
  }
}
