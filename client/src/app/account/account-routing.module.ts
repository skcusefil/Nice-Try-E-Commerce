import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { ProfileComponent } from './profile/profile.component';
import { EditAddressComponent } from './edit-address/edit-address.component';
import { ChangePasswordComponent } from './change-password/change-password.component';


const routes: Routes = [
  {path: 'login', component:LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'edit-address', component: EditAddressComponent},
  {path: 'change-password', component: ChangePasswordComponent}

];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AccountRoutingModule { }
