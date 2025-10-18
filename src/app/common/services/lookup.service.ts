import { inject, Injectable } from '@angular/core';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { MsalService } from '@azure/msal-angular';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment.development';

import { Lookup, MultipleLookups } from '../../models/common/lookup.model';
import { Response } from '../../models/common/response.model';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private _apiService = inject(ApiService);
  private _msal = inject(MsalService);

  private baseUrl = `${environment.apiBaseUrl}/Lookup`;

  /**
   * Helper to get token and create headers
   */
  private getAuthHeaders() {
    const account = this._msal.instance.getActiveAccount();
    if (!account) throw new Error('No active MSAL account found.');

    return from(
      this._msal.instance.acquireTokenSilent({
        scopes: environment.msal.scopes,
        account: account
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
   * Fetch lookups by single type name
   */
  getLookupsByTypeName(typeName: string) {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/${typeName}`;
        return this._apiService.get<Response<Lookup[]>>(url, null, { headers });
      })
    );
  }

  /**
   * Fetch lookups by multiple type names
   */
  getLookupsByMultipleTypeNames(typeNames: string[]) {
    return this.getAuthHeaders().pipe(
      switchMap(headers => {
        const url = `${this.baseUrl}/MultipleLookups`;

        // Build query string manually to have multiple lookupTypeNames params
        const params = new URLSearchParams();
        typeNames.forEach(name => params.append('lookupTypeNames', name));
        const urlWithParams = `${url}?${params.toString()}`;

        return this._apiService.get<Response<MultipleLookups[]>>(urlWithParams, null, { headers });
      })
    );
  }
}
