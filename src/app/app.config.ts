import {
  APP_INITIALIZER,
  ApplicationConfig,
  importProvidersFrom,
  Provider,
} from '@angular/core';
import { provideRouter, RouterModule } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  provideHttpClient,
  withFetch,
} from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MessageService } from 'primeng/api';
// import { TokenInterceptor } from './interceptors/token.interceptor';
// import { adminRoutes } from './components/admin/admin-routes';

// export const appConfig: ApplicationConfig = {
//   providers: [provideRouter(routes), provideClientHydration()]
// };

// const tokenInterceptorProvider: Provider = {
//   provide: HTTP_INTERCEPTORS,
//   useClass: TokenInterceptor,
//   multi: true,
// };

export const appConfig: ApplicationConfig = {
  providers: [
    MessageService,
    provideAnimations(),
    provideRouter(routes),
    //importProvidersFrom(RouterModule.forRoot(routes)),
    // importProvidersFrom(RouterModule.forChild(adminRoutes)),
    provideHttpClient(withFetch()),
    //provideHttpClient(),
    // tokenInterceptorProvider,
    provideClientHydration(),
    importProvidersFrom(HttpClientModule),
  ],
};
