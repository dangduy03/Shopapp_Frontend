import { Injectable } from '@angular/core';

interface Toast {
  message: string;
  className?: string;
  delay?: number;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts: Toast[] = [];

  get toasts(): Toast[] {
    return this._toasts;
  }

  show(
    message: string,
    className: string = 'bg-success text-light',
    delay: number = 5000
  ) {
    this._toasts.push({ message, className, delay });
  }

  remove(toast: Toast) {
    this._toasts = this._toasts.filter((t) => t !== toast);
  }
}
