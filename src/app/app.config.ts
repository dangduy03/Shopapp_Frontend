import {
  ApplicationConfig,
  Provider,
} from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
import { TokenInterceptor } from '../interceptors/token.interceptor';

const tokenInterceptorProvider: Provider =
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true };

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideAnimations(),
    provideRouter(routes),
    // provideZoneChangeDetection({ eventCoalescing: true }),
    //importProvidersFrom(RouterModule.forRoot(routes)),
    // importProvidersFrom(RouterModule.forChild(adminRoutes)),
    provideHttpClient(withFetch()),
    tokenInterceptorProvider,
    provideClientHydration(),
  ],
};