import { Injectable } from "@angular/core";
import { AlertType } from '../models/alert-type.model';
import { StorageService } from './storage.service';

@Injectable()
export class AlertService {

  private message: string = null;
  private type: AlertType = 'primary';

  constructor(private storage: StorageService) {
    const alert = this.storage.get('alert');
    if (alert) {
      this.message = alert.message;
      this.type = alert.type;
    }
    this.storage.set('alert', null);
  }

  getMessage() {
    return this.message;
  }

  getType() {
    return this.type;
  }

  setMessage(message: string, type: AlertType) {
    this.message = message;
    this.type = type;
    this.storage.set('alert', {
      message: this.message,
      type: this.type
    });
  }

  info(message: string) {
    this.setMessage(message, 'primary');
  }

  success(message: string) {
    this.setMessage(message, 'success');
  }

  error(message: string) {
    this.setMessage(message, 'danger');
  }

  warning(message: string) {
    this.setMessage(message, 'warning');
  }

}
