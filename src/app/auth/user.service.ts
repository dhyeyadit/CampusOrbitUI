import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { MsalService } from '@azure/msal-angular';
import { from, switchMap, finalize, forkJoin } from 'rxjs';
import { User } from '../models/user/user.model';
import { Response } from '../models/common/response.model';
import { LoaderService } from '../common/services/loader.service';
import { Module } from '../models/common/module.model';

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
  sidebar=signal<Module[] | null>([])

  loadUser(): void {
  this.loader.show();

  from(
    this.msalService.instance.acquireTokenSilent({
      scopes: environment.msal.scopes,
      account: this.msalService.instance.getActiveAccount()!
    })
  )
  .pipe(
    switchMap(tokenResponse => {
      const headers = { Authorization: `Bearer ${tokenResponse.accessToken}` };

      return forkJoin({
        user: this.http.get<Response<User>>(`${this.baseUrl}/me`, { headers }),
        sidebar: this.http.get<Response<Module[]>>(`${this.baseUrl}/user-permissions`, { headers })
      });
    }),
    finalize(() => this.loader.hide())
  )
  .subscribe({
    next: ({ user, sidebar }) => {
      this.user.set(user.data);
      this.sidebar.set(sidebar.data); // Assuming this.sidebar is a BehaviorSubject or state
    },
    error: err => {
      console.error('User or sidebar load failed', err);
      this.user.set(null);
      this.sidebar.set([]); // fallback
    }
  });
}


  logout() {
    this.msalService.logoutRedirect();
  }
}
