import { Component, isDevMode } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from '../pages/header/header.component';
import { FooterComponent } from '../pages/footer/footer.component';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, FooterComponent, ToastModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'shopery-frontend';
  ngOnInit() {
    if (isDevMode()) {
      console.log('Development!');
    } else {
      console.log('Production!');
    }
  }
}
