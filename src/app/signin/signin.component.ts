import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CallMethodService } from '../services/call-method.service';
import { GlobalService } from '../services/global.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  loginForm: FormGroup

  constructor(private fb: FormBuilder,
    public callMethod: CallMethodService,
    public Global: GlobalService,
    private toastr: ToastrService,
    public router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    let token = this.Global.getLocalStorage({ 'key': 'token' });
    if (token) {
      this.router.navigate(['/home'])
    }
  }

  login() {
    let userName = this.loginForm.get('email')?.value
    let password = this.loginForm.get('password')?.value
    if (userName != '' && password != '') {
      let req = {
        'name': userName,
        'password': password
      }
      this.callMethod.login(req).subscribe((result: any) => {
        if (result.status) {
          this.Global.loginUser = {
            'name': result.data.name,
            'email': result.data.email,
            'gender': result.data.gender,
            'age': result.data.age,
            'image': result.data.image,
            'userId': result.data.user_id,
            'dob':result.data.dob
          }

          this.Global.setLocalStorage({ 'key': 'token', 'value': result.jwtToken });
          this.Global.setLocalStorage({ 'key': 'loginUser', 'value': this.Global.loginUser });
          this.router.navigate(['/home'])
        } else {
          if (result.statusCode == 1) {
            this.toastr.error('Invalid credentials', 'Error!');
          }
          else if (result.statusCode == 2) {
            this.toastr.error('Invalid Password', 'Error!');
          }
        }
      });
    }
    else {
      this.toastr.error('Please enter email and password.', 'Error!');
    }
  }
}
