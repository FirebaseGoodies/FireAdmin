import { Injectable } from "@angular/core";
import { AlertType } from '../models/alert-type.model';
import { StorageService } from './storage.service';

@Injectable()
export class AlertService {

  message: string = null;
  type: AlertType = 'primary';

  constructor(private storage: StorageService) {
    const alert = this.storage.get('alert');
    if (alert) {
      this.message = alert.message;
      this.type = alert.type;
      this.storage.set('alert', null);
    }
  }

  private set(message: string, type: AlertType) {
    this.message = message;
    this.type = type;
    this.storage.set('alert', {
      message: this.message,
      type: this.type
    });
  }

  clear() {
    this.message = null;
    this.storage.set('alert', null);
  }

  info(message: string) {
    this.set(message, 'primary');
  }

  success(message: string) {
    this.set(message, 'success');
  }

  error(message: string) {
    this.set(message, 'danger');
  }

  warning(message: string) {
    this.set(message, 'warning');
  }

}
