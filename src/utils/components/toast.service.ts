import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ToastSeverityEnum } from '../enums/toast-serverity.enum';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private messageService: MessageService) {}

  showToastMessage(
    severity: ToastSeverityEnum,
    summary: string,
    detail: string
  ) {
    this.messageService.add({ severity, summary, detail, life: 3000 });
  }
}
