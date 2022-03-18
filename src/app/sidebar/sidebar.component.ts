import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  constructor(
    private router : Router,
    public Global: GlobalService
    ) { }
  url: string = "home";
  ngOnInit(): void {
    this.url = this.router.url;
    console.log("====url :: ", this.url);
    
  }

}
