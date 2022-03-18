import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from './services/global.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'interview-angular-kishan';

  constructor(
    public Global: GlobalService,
    public router: Router
  ) {

  }

  ngOnInit(): void {
    let token = this.Global.getLocalStorage({ 'key': 'token' });
    console.log("===token :: ", token);
    
    if (token) {
      let user = this.Global.getLocalStorage({ 'key': 'loginUser' });
      if (user) {
        this.Global.loginUser = JSON.parse(user);
      }
    }
    else{
      this.router.navigate(['/sign-in'])
    }
  }

}
