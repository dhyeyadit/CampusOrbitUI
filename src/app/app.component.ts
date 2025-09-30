import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { AuthenticationResult } from '@azure/msal-browser';
import { environment } from '../environments/environment.development';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterOutlet],
})
export class AppComponent implements OnInit {
  constructor(private msalService: MsalService, private router: Router) {}

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
