import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app/app.component';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));

  /**

 npm add bootstrap @ng-bootstrap/ng-bootstrap
 npm add font-awesome @fortawesome/fontawesome-free
 npm add class-transformer class-validator
 npm add @popperjs/core  
 npm add @auth0/angular-jwt
 */