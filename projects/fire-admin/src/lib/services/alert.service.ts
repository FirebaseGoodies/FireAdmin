import { Injectable } from "@angular/core";
import { AlertType } from '../models/alert-type.model';

@Injectable()
export class AlertService {

  private message: string = null;
  private type: AlertType = 'primary';

  constructor() {
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
