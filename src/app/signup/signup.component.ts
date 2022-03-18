import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { CallMethodService } from "../services/call-method.service";
import { GlobalService } from "../services/global.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-signup",
  templateUrl: "./signup.component.html",
  styleUrls: ["./signup.component.scss"],
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  selectedUserType: string = 'male';

  constructor(
    private fb: FormBuilder,
    public callMethod: CallMethodService,
    public Global: GlobalService,
    private toastr: ToastrService,
    public router: Router
  ) {
    this.signupForm = this.fb.group({
      email: [
        "",
        [
          Validators.required,
          Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$"),
        ],
      ],
      name: ["", [Validators.required]],
      dob: [
        "",
        [Validators.required],
      ],
      age: ["", [Validators.required]],
      password: ["", [Validators.required]],
      confirmPassword: ["", [Validators.required]],
      image: "",
      userType: ["", [Validators.required]],
    });
  }

  ngOnInit(): void {
    let token = this.Global.getLocalStorage({ key: "token" });
    if (token) {
      this.router.navigate(["/home"]);
    }
  }

  fileChange(element: any) {
    this.signupForm.patchValue({ image: element.target.files[0] });
    this.signupForm.get("image")?.updateValueAndValidity();
  }

  signup() {
    let email = this.signupForm.get("email")?.value;
    let name = this.signupForm.get("name")?.value;
    let password = this.signupForm.get("password")?.value;
    let confirmPassword = this.signupForm.get("confirmPassword")?.value;
    let gender = this.signupForm.get("userType")?.value;
    let age = this.signupForm.get("age")?.value;
    let dateOfBirth = this.signupForm.get("dob")?.value;
    console.log("===>>>gender <<<<",gender );
    
    if (
      email != "" &&
      name != "" &&
      password != "" &&
      confirmPassword != "" && 
      gender != ""
    ) {
      if (password == confirmPassword) {
        let formData = new FormData();
        formData.append("image", this.signupForm.get("image")?.value);
        formData.append("email", email);
        formData.append("name", name);
        formData.append("password", password);
        formData.append("gender", gender);
        formData.append("age", age);
        formData.append("dateOfBirth", dateOfBirth);
        let req = {
          userName: name,
          userPassword: password,
          userEmail: email,
        };
        this.callMethod.signUp(formData).subscribe((result: any) => {
          console.log("==>result::::", result);
          if (result.status) {
            this.router.navigate(["/sign-in"]);
            this.toastr.success("Sucessfully signup.", "Success!");
          } else {
            if (result.statusCode == 1) {
              this.toastr.error("User already exist!!!", "Error!");
            } else {
              this.toastr.error("Something went wrond.", "Error!");
            }
          }
        });
      } else {
        this.toastr.error("Password do not match.", "Error!");
      }
    } else {
      this.toastr.error("Please fill all details.", "Error!");
    }
  }
}
