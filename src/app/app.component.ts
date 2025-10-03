import { Component, inject, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from "./common/components/layout/layout.component";
import { UserService } from './auth/user.service';
import { LoaderComponent } from "./common/components/loader/loader.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, LayoutComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  private msalService = inject(MsalService);
  private router = inject(Router);
  private userService = inject(UserService);
  loggedInUser=this.userService.user;
  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise()
      .then((result: AuthenticationResult | null) => {
        if (result && result.account) {
          // ✅ store account after first login
          this.msalService.instance.setActiveAccount(result.account);
        }

        const account = this.msalService.instance.getActiveAccount();

        if (account) {
          // ✅ load user profile into signal once account exists
          this.userService.loadUser();
        } else {
          // ✅ if not logged in, trigger redirect
          if (this.router.url !== '/' && this.router.url !== '/redirect') {
            this.msalService.loginRedirect({
              scopes: environment.msal.scopes,
            });
          }
        }
      })
      .catch((error) => {
        console.error('MSAL redirect error:', error);
      });
  }
}
