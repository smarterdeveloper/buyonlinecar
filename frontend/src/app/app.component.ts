import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';

import { UserModel } from './modules/user.model';
import { UserService } from './modules/user.service';
import { AuthenticationService } from './auth/authentication.service';
import { ConditionalExpr } from '@angular/compiler';
import { BillingInfoModel } from './modules/billinginfo.model';
declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title = 'buyanycaronline';

  currentUser: UserModel;
  loginForm   : FormGroup;
  registerForm: FormGroup;
  returnUrl   : string;
  error_msg   : string;

  loading     = false;
  submitted   = false;

  constructor(
      private formBuilder: FormBuilder,
      private router: Router,
      private authenticationService: AuthenticationService,
      private userService: UserService) {

        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);

      }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username        : [' ', Validators.required],
      password        : [' ', [Validators.required, Validators.minLength(5)]]
    });

    this.registerForm = this.formBuilder.group({
      username        : ['', Validators.required],
      password        : ['', [Validators.required, Validators.minLength(5)]],
      confirmPassword : ['', [Validators.required, Validators.minLength(5)]]
    }, {
      validator: this.MustMatch('password', 'confirmPassword')
    });
  }

  MustMatch(controlName: string, matchingControlName: string) {
    return (formGroup: FormGroup) => {
        const control = formGroup.controls[controlName];
        const matchingControl = formGroup.controls[matchingControlName];

        if (matchingControl.errors && !matchingControl.errors.mustMatch) {
            return;
        }

        // set error on matchingControl if validation fails
        if (control.value !== matchingControl.value) {
            matchingControl.setErrors({ mustMatch: true });
        } else {
            matchingControl.setErrors(null);
        }
    }
  }

  // convenience getter for easy access to form fields
  get fLogin() { return this.loginForm.controls; }
  get fRegister() { return this.registerForm.controls; }

  onLoginSubmit() {
    this.submitted = true;

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.authenticationService.login(this.fLogin.username.value, this.fLogin.password.value)
      .pipe(first())
      .subscribe(
        (data:UserModel) => {
          $('#loginPopup').modal('toggle');
          if (data.type == 'ADMIN')
            this.router.navigate(["/monitor-page"]);
          else
            this.router.navigate(['/user-profile/' + data.id]);
        },
        err => {
          this.loginForm.controls["password"].setErrors({ incorrect : true });
          this.loading = false;
        });
  }

  onRegisterSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }
    
    this.loading = true;

    this.userService.addUser(this.registerForm.value)
      .pipe(first())
      .subscribe(
        (user:UserModel) => {
          if (user && user.token) {
            $('#registerPopup').modal('toggle');
            $('#loginPopup').modal('toggle');
          }
        },
        err => {
            this.registerForm.controls["confirmPassword"].setErrors({ exist : true });
            this.loading = false;
        });
  }

  logout() {
    this.authenticationService.logout();
    this.router.navigate(['']);
  }

  menuFunction() {
    var x = document.getElementById("mainMenu-links");
    if (x.className === "clearfix") {
      x.className += " open";
    } else {
      x.className = "clearfix";
    }
  }
}

