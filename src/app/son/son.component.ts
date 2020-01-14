import {Input, Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-son',
  templateUrl: './son.component.html',
  styleUrls: ['./son.component.css']
})
export class SonComponent implements OnInit {
@Input() state;
  constructor() { }

  ngOnInit() {
  }
on(){
  console.log("ok");
}
}