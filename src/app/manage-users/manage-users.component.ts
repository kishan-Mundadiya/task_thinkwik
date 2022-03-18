import { Component, OnInit } from '@angular/core';
import { NgbModalConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CallMethodService } from '../services/call-method.service';
import { GlobalService } from '../services/global.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss'],
  providers: [NgbModalConfig, NgbModal]
})
export class ManageUsersComponent implements OnInit {
  constructor(
    config: NgbModalConfig,
    private modalService: NgbModal,
    public callMethod: CallMethodService,
    public Global: GlobalService,
    private toastr: ToastrService,
    public router: Router
  ) {
    
  }

  ngOnInit(): void {
    this.getEvents(1)
  }

 selectedEvent:any = []
  open(content: any, item: any) {
    this.selectedEvent = item;
    console.log("==>>this.selectedEvent::",this.selectedEvent);
    
    this.modalService.open(content);
    this.getParticipants(this.selectedEvent.event_id)
  }

  participants:any = []
  getParticipants(eventId:string){

    this.callMethod.getParticipant({eventId:eventId}).subscribe((result:any)=>{
      if(result.status){
        this.participants = result.data
      }
    })
  }

  limit: number = 2;
  currentPage: number = 0;
  total: number = 0;
  events:any = [];
  getEvents(event:any){
    this.currentPage = event;
    let offset = 0;
    if (this.currentPage > 1) {
      offset = ((this.currentPage - 1) * this.limit)
    }
    let req = {
      'offset': offset,
      'limit': this.limit,
    }

    this.callMethod.getAllEvents(req).subscribe((result:any)=>{
      if(result.status){
        this.events = result.data;
        this.total = result.totalCount
      }
    })
  } 

  joinEvent(event:any){
    let req = {
      'eventId':event.event_id,
      'eventName':event.name,
      'eventAddress':event.place,
      'userName':this.Global.loginUser.name,
      'userEmail':this.Global.loginUser.email,
      'userId':this.Global.loginUser.userId
    }

    this.callMethod.joinEvent(req).subscribe((result:any)=>{
      if(result.status){
        this.toastr.success("successfully joined event", "Success!");
      } 
      else if(result.status == false && result.statusCode == 1) {
        this.toastr.error("Already joined this event",'Aw snap!!!')
      }
    })
  }

}
