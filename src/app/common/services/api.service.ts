import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { from, Observable, switchMap } from 'rxjs';
import { MsalService } from '@azure/msal-angular';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private http = inject(HttpClient);
  private _msal = inject(MsalService);

  private getAuthHeaders() {
    const account = this._msal.instance.getActiveAccount();
    if (!account) throw new Error('No active MSAL account found.');

    return from(
      this._msal.instance.acquireTokenSilent({
        scopes: environment.msal.scopes,
        account
      })
    ).pipe(
      switchMap(tokenResponse => {
        const headers = new HttpHeaders({
          Authorization: `Bearer ${tokenResponse.accessToken}`
        });
        return [headers];
      })
    );
  }

  get<T>(url: string, params?: any, options?: { headers?: HttpHeaders }): Observable<T> {
    return this.getAuthHeaders().pipe(
      switchMap(authHeaders =>
        this.http.get<T>(url, {
          params: this.buildHttpParams(params),
          headers: options?.headers ? options.headers : authHeaders
        })
      )
    );
  }

  post<T>(url: string, body: any): Observable<T> {
    return this.getAuthHeaders().pipe(
      switchMap(authHeaders =>
        this.http.post<T>(url, body, { headers: authHeaders })
      )
    );
  }

  postForm<T>(url: string, formData: FormData): Observable<T> {
    return this.getAuthHeaders().pipe(
      switchMap(authHeaders =>
        this.http.post<T>(url, formData, { headers: authHeaders })
      )
    );
  }

  put<T>(url: string, body: any): Observable<T> {
    return this.getAuthHeaders().pipe(
      switchMap(authHeaders =>
        this.http.put<T>(url, body, { headers: authHeaders })
      )
    );
  }

  delete<T>(url: string): Observable<T> {
    return this.getAuthHeaders().pipe(
      switchMap(authHeaders =>
        this.http.delete<T>(url, { headers: authHeaders })
      )
    );
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
