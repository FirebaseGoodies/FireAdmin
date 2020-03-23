# FireAdmin

[![NPM version](https://img.shields.io/npm/v/ng-fire-admin)](https://www.npmjs.com/package/ng-fire-admin)
[![Downloads](https://img.shields.io/npm/dt/ng-fire-admin)](https://www.npmjs.com/package/ng-fire-admin)
[![License](https://img.shields.io/npm/l/ng-fire-admin)](LICENSE)

A minimalistic headless CMS around Angular & Firebase.

![screenshot](https://github.com/AXeL-dev/FireAdmin/blob/master/screenshots/dashboard.png?raw=true)

## Demo

[FireAdmin Demo](https://axel-dev.github.io/FireAdmin/demo/login?email=guest@fireadmin.com&password=fireadmin)

## Features

- Simple & minimalistic
- Customizable
- Responsive
- Internationalization ready
- Easy/automated updates (via npm)

## ToDo

- [ ] Menus handler
- [ ] Password reset feature
- [ ] Posts comments
- [ ] Posts custom fields

## Installation

```
npm install --save ng-fire-admin
```

## Usage

> It's recommended to use a [multi-project workspace](https://angular.io/guide/file-structure#multiple-projects) with basically 2 main applications (one for the frontend part & the other for the backend) to avoid any potential conflicts, then apply the following changes on your backend app:

<details>
  <summary>Multi-project creation steps</summary>
  
  ```bash
    ng new my-workspace --createApplication="false"
    cd my-workspace
    ng generate application backend --defaults --routing=true
    // you can add the frontend app the same way
    npm install --save ng-fire-admin
  ```
</details>

**1**. Add your firebase configuration in `environment.ts`:

```diff
  export const environment = {
    production: false,
+   firebase: {
+     apiKey: "<API_KEY>",
+     authDomain: "<PROJECT_ID>.firebaseapp.com",
+     databaseURL: "https://<DATABASE_NAME>.firebaseio.com",
+     projectId: "<PROJECT_ID>",
+     storageBucket: "<BUCKET>.appspot.com",
+     messagingSenderId: "<SENDER_ID>",
+     appId: "<APP_ID>"
+   }
  };
```

**2**. Register the `FireAdminModule` in a module, for example app module:

```diff
  import { BrowserModule } from '@angular/platform-browser';
  import { NgModule } from '@angular/core';

  import { AppRoutingModule } from './app-routing.module';
  import { AppComponent } from './app.component';
+ import { FireAdminModule } from 'ng-fire-admin';
+ import { environment } from '../environments/environment';

  @NgModule({
    declarations: [AppComponent],
    imports: [
      BrowserModule,
      AppRoutingModule,
+     FireAdminModule.initialize(environment.firebase)
    ],
    providers: [],
    bootstrap: [AppComponent]
  })
  export class AppModule {}
```

**3**. Setup a simple routing as below:

```diff
  import { NgModule } from '@angular/core';
  import { Routes, RouterModule } from '@angular/router';

  const routes: Routes = [
+   {
+     path: 'admin',
+     loadChildren: () => import('ng-fire-admin').then(m => m.FireAdminModule)
+   },
+   {
+     path: '**',
+     redirectTo: 'admin'
+   }
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }
```

**4**. Edit your main component template (generally `app.component.html`) & keep only the `<router-outlet></router-outlet>` line:

```diff
+ <router-outlet></router-outlet>
```

**5**. Add the following styles & scripts entries to `angular.json`:

```diff
  "assets": [
    "projects/backend/src/favicon.ico",
    "projects/backend/src/assets"
  ],
  "styles": [
    "projects/backend/src/styles.css",
+   "node_modules/@fortawesome/fontawesome-free/css/all.min.css",
+   "node_modules/material-icons-font/material-icons-font.css",
+   "node_modules/bootstrap/dist/css/bootstrap.min.css",
+   "node_modules/datatables.net-responsive-dt/css/responsive.dataTables.min.css",
+   "node_modules/quill/dist/quill.snow.css"
  ],
  "scripts": [
+   "node_modules/jquery/dist/jquery.min.js",
+   "node_modules/popper.js/dist/umd/popper.min.js",
+   "node_modules/bootstrap/dist/js/bootstrap.min.js",
+   "node_modules/datatables.net/js/jquery.dataTables.min.js",
+   "node_modules/datatables.net-responsive-dt/js/responsive.dataTables.min.js",
+   "node_modules/chart.js/dist/Chart.min.js",
+   "node_modules/shards-ui/dist/js/shards.min.js",
+   "node_modules/quill/dist/quill.min.js"
  ]
```

**6**. You may also need to add the following lines to `polyfills.ts`:

```diff
  // Add global to window, assigning the value of window itself.
+ (window as any).global = window;
```

**7**. In order to protect your database & storage data, you must set the following rules in your firebase console:

**Firestore Database rules:**

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{collection}/{document=**} {
      allow read: if collection != 'users' || isAdmin() || isOwner();
      allow write: if registrationEnabled() || isAdmin() || (isEditor() && collection != 'users');
    }
    function isSignedIn() {
      return request.auth != null;
    }
    function hasRole(role) {
      return isSignedIn() && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == role;
    }
    function isAdmin() {
      return hasRole('admin');
    }
    function isEditor() {
      return hasRole('editor');
    }
    function isOwner() {
      return isSignedIn() && request.auth.uid == resource.id;
    }
    function registrationEnabled() {
      return get(/databases/$(database)/documents/config/registration).data.enabled || true;
    }
  }
}
```

<details>
  <summary>More basic database rules?</summary>
  
  ```javascript
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /{collection}/{document=**} {
          allow read: if collection != 'users' || request.auth != null;
          allow write: if request.auth != null;
        }
      }
    }
  ```
</details>

**Storage rules:**

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if request.auth != null;
    }
  }
}
```

That's it :tada:, enjoy your ready to use backend app!

## Troubleshoot

In case you encounter one of the following errors while trying to serve or build your app:

```javascript
Cannot find type definition file for 'datatables.net'.
Cannot find namespace 'DataTables'.
```

Just install the following package:

```
npm install --save-dev @types/datatables.net
```

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build`, go to the dist folder `cd dist/fire-admin` and run `npm publish`.

## Credits

<a target="_blank" href="https://icons8.com/icons/set/firebase">Firebase icon</a> by <a target="_blank" href="https://icons8.com">Icons8</a>.

## License

This project is licensed under the [MIT](LICENSE) license.
