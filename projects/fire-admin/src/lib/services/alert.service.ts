import { Injectable } from "@angular/core";
import { AlertType } from '../models/alert-type.model';
import { StorageService } from './storage.service';

@Injectable()
export class AlertService {

  message: string = null;
  type: AlertType = 'primary';

  constructor(private storage: StorageService) {
    const alert = this.storage.get('flash_alert');
    if (alert) {
      this.set(alert.message, alert.type);
      this.storage.set('flash_alert', null);
      // setTimeout(() => {
      //   this.clear();
      // }, 5000);
    }
  }

  private set(message: string, type: AlertType, isFlashAlert: boolean = false) {
    if (isFlashAlert) {
      this.storage.set('flash_alert', {
        message: message,
        type: type
      });
    } else {
      this.message = message;
      this.type = type;
    }
  }

  clear() {
    this.message = null;
    this.storage.set('flash_alert', null);
  }

  info(message: string, isFlashAlert: boolean = false) {
    this.set(message, 'primary', isFlashAlert);
  }

  success(message: string, isFlashAlert: boolean = false) {
    this.set(message, 'success', isFlashAlert);
  }

  error(message: string, isFlashAlert: boolean = false) {
    this.set(message, 'danger', isFlashAlert);
  }

  warning(message: string, isFlashAlert: boolean = false) {
    this.set(message, 'warning', isFlashAlert);
  }

}
