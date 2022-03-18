import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  currenturl: string = "home";
  constructor(
    public router: Router,
    public Global: GlobalService,
  ) { }

  ngOnInit(): void {
    this.currenturl = this.router.url;
    console.log("==>this.currenturl::",this.currenturl);
    
  }

}
