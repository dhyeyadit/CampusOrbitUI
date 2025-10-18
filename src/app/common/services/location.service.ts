import { inject, Injectable } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MsalService } from '@azure/msal-angular';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment.development';
import { Response } from '../../models/common/response.model';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private _apiService = inject(ApiService);
  private _msal = inject(MsalService);

  private baseUrl = `${environment.apiBaseUrl}/Location`;

  /**
   * Helper to get auth headers using MSAL
   */
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
        const headers = {
          Authorization: `Bearer ${tokenResponse.accessToken}`
        };
        return [headers];
      })
    );
  }

  /**
   * Get all states from backend
   */
  getStates() {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/states`;
        return this._apiService.get<Response<string[]>>(url, null, { headers });
      })
    );
  }

  /**
   * Get cities by state from backend
   */
  getCitiesByState(state: string) {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        const encodedState = encodeURIComponent(state);
        const url = `${this.baseUrl}/cities/${encodedState}`;
        return this._apiService.get<Response<string[]>>(url, null, { headers });
      })
    );
  }
}
