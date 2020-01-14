import { Component, OnInit,ViewChild } from '@angular/core';
import { BehaviorSubject,Subject, Observable,merge,pipe,fromEvent,of } from 'rxjs';
@Component({
  selector: 'app-father',
  templateUrl: './father.component.html',
  styleUrls: ['./father.component.css']
})
export class FatherComponent implements OnInit {
  @ViewChild('myTemplate', {static: true}) myTemplate: any;
  source=Array.from({length: 100000}).map((_, i) => `Item #${i}`);
  numberOfItems=20;
  pageNext(page:number): Observable< any>{
    let itemCount=(page-1)*this.numberOfItems;
    return of(this.source.slice(itemCount,itemCount+this.numberOfItems));
  }
  option={
    handle:page=>{
    let itemCount=(page-1)*this.numberOfItems;
    return of(this.source.slice(itemCount,itemCount+this.numberOfItems));
    },
    itemNumber:this.numberOfItems,
    itemHeight:20,
    style:{
      height:'400px',
      width:'200px'
    }
  }

  constructor() { }

  ngOnInit() {
  }

}