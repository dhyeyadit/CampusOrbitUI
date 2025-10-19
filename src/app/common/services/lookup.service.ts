import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment.development';
import { Lookup, MultipleLookups } from '../../models/common/lookup.model';
import { Response } from '../../models/common/response.model';

@Injectable({
  providedIn: 'root'
})
export class LookupService {
  private _apiService = inject(ApiService);
  private baseUrl = `${environment.apiBaseUrl}/Lookup`;

  /**
   * Fetch lookups by single type name
   */
  getLookupsByTypeName(typeName: string) {
    const url = `${this.baseUrl}/${typeName}`;
    return this._apiService.get<Response<Lookup[]>>(url);
  }

  /**
   * Fetch lookups by multiple type names
   */
  getLookupsByMultipleTypeNames(typeNames: string[]) {
    const url = `${this.baseUrl}/MultipleLookups`;

    // Build query string manually to have multiple lookupTypeNames params
    const params = new URLSearchParams();
    typeNames.forEach(name => params.append('lookupTypeNames', name));
    const urlWithParams = `${url}?${params.toString()}`;

    return this._apiService.get<Response<MultipleLookups[]>>(urlWithParams);
  }
}
