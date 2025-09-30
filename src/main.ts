import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import {
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MsalInterceptor,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MSAL_INTERCEPTOR_CONFIG,
} from '@azure/msal-angular';

import {
  msalInstanceFactory,
  msalGuardConfigFactory,
  msalInterceptorConfigFactory,
} from './app/auth/msal-config';

import { AppComponent } from './app/app.component';
import { routes } from './app/app.routes';

async function bootstrap() {
  // Create MSAL instance
  const msalInstance = msalInstanceFactory();

  try {
    // Await initialize() before anything else
    await msalInstance.initialize();

    // After initialization, bootstrap the Angular app and provide MSAL stuff
    await bootstrapApplication(AppComponent, {
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MsalInterceptor,
          multi: true,
        },
        { provide: MSAL_INSTANCE, useValue: msalInstance },  // Provide the already initialized instance
        { provide: MSAL_GUARD_CONFIG, useFactory: msalGuardConfigFactory },
        { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: msalInterceptorConfigFactory },
        MsalService,
        MsalBroadcastService,
        MsalGuard,
      ],
    });
  } catch (error) {
    console.error('MSAL initialization failed:', error);
  }
}

bootstrap();
