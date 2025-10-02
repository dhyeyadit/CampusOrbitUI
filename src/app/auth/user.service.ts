import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { MsalService } from '@azure/msal-angular';
import { from, Observable, switchMap, finalize, tap } from 'rxjs';
import { User } from '../models/user/user.model';
import { Response } from '../models/common/response.model';
import { LoaderService } from '../common/services/loader.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private msalService = inject(MsalService);
  private loader = inject(LoaderService);
  baseUrl = environment.authConfig.apiUrl;

  getUser$(): Observable<Response<User>> {
    this.loader.show(); // show loader before any request

    return from(
      this.msalService.instance.acquireTokenSilent({
        scopes: environment.msal.scopes,
        account: this.msalService.instance.getActiveAccount()!
      })
    ).pipe(
      switchMap(tokenResponse => 
        this.http.get<Response<User>>(`${this.baseUrl}/me`, {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`
          }
        })
      ),
      finalize(() => this.loader.hide()) // hide loader after request completes
    );
  }
}
