import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { MsalService } from '@azure/msal-angular';
import { from, switchMap, finalize } from 'rxjs';
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

  // ✅ store user in signal
  user = signal<User | null>(null);

  loadUser(): void {
    this.loader.show();

    from(
      this.msalService.instance.acquireTokenSilent({
        scopes: environment.msal.scopes,
        account: this.msalService.instance.getActiveAccount()!
      })
    )
    .pipe(
      switchMap(tokenResponse =>
        this.http.get<Response<User>>(`${this.baseUrl}/me`, {
          headers: { Authorization: `Bearer ${tokenResponse.accessToken}` }
        })
      ),
      finalize(() => this.loader.hide())
    )
    .subscribe({
      next: res => this.user.set(res.data),
      error: err => {
        console.error('User load failed', err);
        this.user.set(null);
      }
    });
  }

  logout() {
    this.msalService.logoutRedirect();
  }
}
