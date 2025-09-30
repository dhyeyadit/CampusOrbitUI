import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'CampusOrbitApp';

  private msal = inject(MsalService);

  constructor() {
    const accounts = this.msal.instance.getAllAccounts();
    if (accounts.length === 0) {
      this.msal.loginRedirect();
    } else {
      this.msal.instance.setActiveAccount(accounts[0]);
    }
  }
}
