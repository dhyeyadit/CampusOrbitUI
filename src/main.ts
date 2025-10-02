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
import { LoaderInterceptor } from './app/common/interceptors/loader.interceptor';

async function bootstrap() {
  // 1️⃣ Create and initialize MSAL instance
  const msalInstance = msalInstanceFactory();
  try {
    await msalInstance.initialize();

    // 2️⃣ Bootstrap Angular standalone app
    await bootstrapApplication(AppComponent, {
      providers: [
        provideRouter(routes),
        provideHttpClient(),
        // HTTP interceptors
        {
          provide: HTTP_INTERCEPTORS,
          useClass: LoaderInterceptor,  // Loader for all HTTP requests
          multi: true,
        },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: MsalInterceptor,    // MSAL token injection
          multi: true,
        },
        // MSAL providers
        { provide: MSAL_INSTANCE, useValue: msalInstance },
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
