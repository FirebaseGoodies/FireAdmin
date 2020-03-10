import { Component, OnInit } from '@angular/core';
import { getDefaultAvatar } from '../../../helpers/assets.helper';
import { UserRole } from '../../../models/collections/user.model';
import { UsersService } from '../../../services/collections/users.service';
import { AlertService } from '../../../services/alert.service';
import { I18nService } from '../../../services/i18n.service';
import { NavigationService } from '../../../services/navigation.service';

@Component({
  selector: 'fa-users-add',
  templateUrl: './users-add.component.html',
  styleUrls: ['./users-add.component.css']
})
export class UsersAddComponent implements OnInit {

  firstName: string;
  lastName: string;
  email: string;
  password: string;
  birthDate: string;
  role: UserRole;
  allRoles: object|any = {};
  bio: string;
  private avatar: File;
  avatarSrc: string|ArrayBuffer;

  constructor(
    private users: UsersService,
    private alert: AlertService,
    private i18n: I18nService,
    private navigation: NavigationService
  ) { }

  ngOnInit() {
    this.allRoles = this.users.getAllRoles();
    this.role = UserRole.Guest;
    this.avatar = null;
    this.avatarSrc = getDefaultAvatar();
    this.bio = null;
  }

  onAvatarChange(event: Event) {
    this.avatar = (event.target as HTMLInputElement).files[0];
    const reader = new FileReader();
    reader.onload = () => {
      this.avatarSrc = reader.result;
    };
    reader.readAsDataURL(this.avatar);
  }

  addUser(event: Event, form: HTMLFormElement) {
    form.isSubmitted = true;
    if (form.checkValidity()) {
      const target = event.target as any;
      const startLoading = () => {
        target.isDisabled = true;
        target.isLoading = true;
      };
      const stopLoading = () => {
        target.isDisabled = false;
        target.isLoading = false;
      };
      startLoading();
      // Add user
      this.users.add({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
        password: this.password,
        birthDate: this.birthDate ? new Date(this.birthDate).getTime() : null,
        role: this.role,
        bio: this.bio,
        avatar: this.avatar
      }).then(() => {
        this.alert.success(this.i18n.get('UserAdded'), false, 5000, true);
        this.navigation.redirectTo('users', 'list');
      }).catch((error: Error) => {
        this.alert.error(error.message);
      }).finally(() => {
        stopLoading();
      });
    }
  }

}
