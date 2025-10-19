import { inject, Injectable, signal } from '@angular/core';
import { finalize, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { User } from '../models/user/user.model';
import { Response } from '../models/common/response.model';
import { LoaderService } from '../common/services/loader.service';
import { Module } from '../models/common/module.model';
import { ApiService } from '../common/services/api.service';
import { MsalService } from '@azure/msal-angular';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _apiService = inject(ApiService);
  private loader = inject(LoaderService);
  private msalService = inject(MsalService);

  baseUrl = environment.authConfig.apiUrl;

  // Signals for user and sidebar modules
  user = signal<User | null>(null);
  sidebar = signal<Module[]>([]);

  loadUser(): void {
    this.loader.show();

    forkJoin({
      user: this._apiService.get<Response<User>>(`${this.baseUrl}/me`),
      sidebar: this._apiService.get<Response<Module[]>>(`${this.baseUrl}/user-permissions`)
    })
    .pipe(finalize(() => this.loader.hide()))
    .subscribe({
      next: ({ user, sidebar }) => {
        this.user.set(user.data);
        this.sidebar.set(sidebar.data ?? []);
      },
      error: err => {
        console.error('❌ User or sidebar load failed', err);
        this.user.set(null);
        this.sidebar.set([]);
      }
    });
  }

  logout() {
    this.msalService.logoutRedirect();
  }
}
