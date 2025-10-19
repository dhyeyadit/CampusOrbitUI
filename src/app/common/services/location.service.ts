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

  private baseUrl = `${environment.apiBaseUrl}/Location`;

  

  /**
   * Get all states from backend
   */
  getStates() {
    const url = `${this.baseUrl}/states`;
    return this._apiService.get<Response<string[]>>(url);
  }

  /**
   * Get cities by state from backend
   */
  getCitiesByState(state: string) {
    const url = `${this.baseUrl}/cities/${state}`;
    return this._apiService.get<Response<string[]>>(url)
  }
}
