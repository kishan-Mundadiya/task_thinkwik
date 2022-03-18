import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class GlobalService {
  constructor(
    public router: Router
  ) { }

  loginUser: any = {
    'userId': '',
    'name': '',
    'email': '',
    'phone': '',
    'gender': '',
    'age': '',
    'userType': 0,
    'children': [],
  }

  setLocalStorage(opts: any) {
    if (opts.key && opts.value) {
      localStorage.setItem(opts.key, JSON.stringify(opts.value));
    }
  }

  getLocalStorage(opts: any) {
    if (opts.key) {
      let item = localStorage.getItem(opts.key);
      return item != null && typeof item == 'object' ? JSON.parse(item) : item
    } else {
      return false
    }
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/sign-in'])
  }

}
