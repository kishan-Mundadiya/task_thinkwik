import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { CallMethodService } from '../services/call-method.service';
import { GlobalService } from '../services/global.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  eventForm: FormGroup

  constructor(
    public Global: GlobalService,
    public router: Router,
    public CallMethod:CallMethodService,
    private modalService: NgbModal,
    private fb:FormBuilder,
    private toastr: ToastrService,
  ) {

    this.eventForm = this.fb.group({
      userId: [''],
      eventName: ['', [Validators.required]],
      eventAddress: ['', [Validators.required]],
    })
  }

  ngOnInit(): void {
    this.joinedEvents()
  }

  selectedEvent:any = [];
  open(content: any,event:any) {
    this.selectedEvent = event;
    this.modalService.open(content);
  }

  createEvent(){
    let eventName = this.eventForm.get('eventName')?.value
    let eventAddress = this.eventForm.get('eventAddress')?.value
    console.log("===>>>eventNAme:::",this.eventForm.get('eventName')?.value);
    
    let req = {
      'eventName':eventName,
      'eventAddress':eventAddress,
      'userName':this.Global.loginUser.name,
      'userEmail':this.Global.loginUser.email,
      'userId':this.Global.loginUser.userId
    }
    this.CallMethod.createEvent(req).subscribe((result:any)=>{
      if(result.status){
        this.toastr.success("event successfully created .", "Success!");
        this.modalService.dismissAll();
        this.joinedEvents()
      }
    })
    
  }

  joinEvents:any = [];
  joinedEvents(){

    this.CallMethod.getJoinEvent({userId:this.Global.loginUser.userId}).subscribe((result:any)=>{
      if(result.status){
        this.joinEvents = result.data;
        console.log("===>>this.joinEvents::",this.joinEvents);
        
      }
    });
  }

  leaveEvent(event:any){
    console.log("==>>leave event:::",event);
    let req = {
      'userId':event.participant_id,
      'eventId':event.event_id
    }
    this.CallMethod.leaveEvent(req).subscribe((result:any)=>{
      if(result.status ){
        this.toastr.success('left successfully!!','Event')
       this.joinEvents();
      }
    })
  }

}

