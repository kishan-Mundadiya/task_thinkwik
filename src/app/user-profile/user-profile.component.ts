import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CallMethodService } from '../services/call-method.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  userForm: FormGroup

  constructor(private fb: FormBuilder,
    public callMethod: CallMethodService,
    public Global: GlobalService,
    private toastr: ToastrService,
    public router: Router
  ) {
    this.userForm = this.fb.group({
      email: ['', [Validators.required,
      Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      age: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      dob: ['', [Validators.required]],
      image:'',
    })
  }


  ngOnInit(): void {

    let gender = (this.Global.loginUser.gender != null) ? this.Global.loginUser.gender : 'male';
    let age = (this.Global.loginUser.age != null) ? this.Global.loginUser.age : 0;
    console.log("==>dob::",this.Global.loginUser.dob);
    
    this.userForm.patchValue({
      'name': this.Global.loginUser.name,
      'email': this.Global.loginUser.email,
      'phone': this.Global.loginUser.phone,
      'gender': gender,
      'age': age,
      'image':this.Global.loginUser.image,
      'dob':this.Global.loginUser.dob
    });

  }

  fileChange(element: any) {
    this.userForm.patchValue({ image: element.target.files[0] });
    this.userForm.get("image")?.updateValueAndValidity();
  }

  updateUserDetails() {
    let name = this.userForm.get('name')?.value
    let email = this.userForm.get('email')?.value
    let dateOfBirth = this.userForm.get('dob')?.value
    let gender = this.userForm.get('gender')?.value
    let age = this.userForm.get('age')?.value
    let image = this.userForm.get('image')?.value
    let userId = this.Global.loginUser.userId 

    let formData = new FormData();
    formData.append("userId",userId);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("dateOfBirth", dateOfBirth);
    formData.append("gender", gender);
    formData.append("age", age);
    formData.append("image", image);

    this.callMethod.updateUser(formData).subscribe((result: any) => {
      if (result.status) {
        this.Global.loginUser.name = result.data.name;
        this.Global.loginUser.email = result.data.email;
        this.Global.loginUser.gender = result.data.gender;
        this.Global.loginUser.age = result.data.age;
        this.Global.loginUser.image = result.data.image;
        this.Global.loginUser.dob = result.data.dob;

        this.Global.setLocalStorage({ 'key': 'loginUser', 'value': this.Global.loginUser });
        this.toastr.success('Successfully edited.', 'Success!');
        this.router.navigate(['/home'])
      }
      else {
        console.log("=======Something wrong");
      }
    });

  }

}
