import { Component } from '@angular/core';
import { ToastService } from './toast.service';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [NgbToastModule, CommonModule],
  template: `
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <ngb-toast
        *ngFor="let toast of toastService.toasts"
        [class]="toast.className"
        [autohide]="true"
        [delay]="toast.delay || 5000"
        (hidden)="toastService.remove(toast)"
      >
        {{ toast.message }}
      </ngb-toast>
    </div>
  `,
  styleUrls: ['./toast.component.scss'],
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
