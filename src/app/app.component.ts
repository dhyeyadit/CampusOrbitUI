import { Component, inject, OnInit, signal } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { environment } from '../environments/environment.development';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from "./common/components/layout/layout.component";

@Component({
  selector: 'app-root',
  imports: [CommonModule, LayoutComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  msalService=inject(MsalService);
  router=inject(Router)
  ngOnInit(): void {
    this.msalService.instance.handleRedirectPromise()
      .then((result: AuthenticationResult | null) => {
        if (result && result.account) {
          this.msalService.instance.setActiveAccount(result.account);
        }

        if (!this.msalService.instance.getActiveAccount()) {
          // Only trigger loginRedirect if NOT already on redirectUri path
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
