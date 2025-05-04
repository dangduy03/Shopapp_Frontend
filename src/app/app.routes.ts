import { Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { LoginComponent } from '../pages/login/login.component';
import { AboutUsComponent } from '../pages/about-us/about-us.component';
import { ContactUsComponent } from '../pages/contact-us/contact-us.component';
import { RegisterComponent } from '../pages/register/register.component';
import { BigProductComponent } from '../pages/big-product/big-product.component';
import { NotFoundComponent } from '../pages/erros/not-found/not-found.component';
import { UserProfileComponent } from '../pages/user-profile/user-profile.component';
import { DetailProductComponent } from '../pages/detail-product/detail-product.component';
import { OrderDetailComponent } from '../pages/detail-order/detail-order.component';
import { AuthGuardFn } from '../guards/auth.guard';
import { OrderComponent } from '../pages/order/order.component';
import { ProfileComponent } from '../pages/profile/profile.component';
import { CartComponent } from '../pages/cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about-us', component: AboutUsComponent },
  { path: 'contact-us', component: ContactUsComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'big', component: BigProductComponent },
  // { path: '**', component: NotFoundComponent },
  { path: 'orders', component: OrderComponent, canActivate: [AuthGuardFn] },
  { path: 'user-profile', component: UserProfileComponent, canActivate: [AuthGuardFn] },
  { path: 'products/:id', component: DetailProductComponent },
  { path: 'orders/:id', component: OrderDetailComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'cart', component: CartComponent },



];
