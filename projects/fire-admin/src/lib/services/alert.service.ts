import { Injectable } from "@angular/core";
import { AlertType } from '../models/alert-type.model';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AlertService {

  message: string = null;
  type: AlertType = 'primary';
  icon: string = null;
  isPersistent: boolean = false;
  private timeoutHandle: any = null;

  constructor(private localStorage: LocalStorageService) {
    const alert = this.localStorage.get('flash_alert');
    if (alert) {
      this.set(alert.message, alert.type);
      this.localStorage.set('flash_alert', null);
      if (alert.timeout) {
        this.clearAfterTimeout(alert.timeout);
      }
    }
  }

  private set(message: string, type: AlertType, isFlashAlert: boolean = false, timeout: number = null, isPersistent: boolean = false) {
    if (isFlashAlert) {
      this.localStorage.set('flash_alert', {
        message: message,
        type: type,
        timeout: timeout
      });
    } else {
      this.message = message;
      this.type = type;
      switch(this.type) {
        case 'primary':
          this.icon = 'info';
          break;
        case 'success':
          this.icon = 'check';
          break;
        case 'warning':
          this.icon = 'exclamation';
          break;
        case 'danger':
          this.icon = 'ban';
          break;
        default:
          this.icon = null;
      }
      if (timeout) {
        this.clearAfterTimeout(timeout);
      }
      this.isPersistent = isPersistent;
    }
  }

  private clearAfterTimeout(timeout: number) {
    if (this.timeoutHandle) {
      clearTimeout(this.timeoutHandle);
    }
    this.timeoutHandle = setTimeout(() => this.clear(), timeout);
  }

  clear(clearFlashAlert: boolean = false) {
    this.message = null;
    if (clearFlashAlert) {
      this.localStorage.set('flash_alert', null);
    }
  }

  info(message: string, isFlashAlert: boolean = false, timeout: number = null, isPersistent: boolean = false) {
    this.set(message, 'primary', isFlashAlert, timeout, isPersistent);
  }

  success(message: string, isFlashAlert: boolean = false, timeout: number = null, isPersistent: boolean = false) {
    this.set(message, 'success', isFlashAlert, timeout, isPersistent);
  }

  error(message: string, isFlashAlert: boolean = false, timeout: number = null, isPersistent: boolean = false) {
    this.set(message, 'danger', isFlashAlert, timeout, isPersistent);
  }

  warning(message: string, isFlashAlert: boolean = false, timeout: number = null, isPersistent: boolean = false) {
    this.set(message, 'warning', isFlashAlert, timeout, isPersistent);
  }

}
