import { Component, OnInit } from '@angular/core';
import { getLogo } from '../../helpers/assets.helper';
import { NavigationService } from '../../services/navigation.service';
import { UsersService } from '../../services/collections/users.service';
import { UserRole } from '../../models/collections/user.model';

@Component({
  selector: 'fa-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  logo: string = getLogo();
  email: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  error: string = null;

  constructor(public navigation: NavigationService, private users: UsersService) { }

  ngOnInit() {
  }

  onSubmit(event: Event, submitButton: HTMLButtonElement|any) {
    const form = event.target as any;
    form.isSubmitted = true;
    if (form.checkValidity() && this.password === this.passwordConfirmation) {
      const startLoading = () => {
        submitButton.isDisabled = true;
        submitButton.isLoading = true;
      };
      const stopLoading = () => {
        submitButton.isDisabled = false;
        submitButton.isLoading = false;
      };
      startLoading();
      // Register admin
      this.users.register({
        firstName: 'Super',
        lastName: 'Admin',
        email: this.email,
        password: this.password,
        role: UserRole.Administrator,
        birthDate: null,
        bio: null
      }).then(() => {
        this.navigation.redirectTo(`login?email=${this.email}&password=${this.password}`);
      }).catch((error: Error) => {
        this.error = error.message;
      }).finally(() => {
        stopLoading();
      });
    }
  }

  dismissError(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.error = null;
  }

}
