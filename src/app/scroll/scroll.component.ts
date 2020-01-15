import {ViewChild, Component, OnInit,ChangeDetectionStrategy,Input } from '@angular/core';
import {CdkScrollable, ScrollDispatcher} from '@angular/cdk/overlay';
import { BehaviorSubject,Subject, Observable,merge,pipe,fromEvent,of } from 'rxjs';
import { ElementRef } from '@angular/core';
import { map,delay, filter, debounceTime, distinct, mergeMap, tap} from 'rxjs/operators';
import {ScrollService} from './scroll.service';
@Component({
  selector: 'app-scroll',
  templateUrl: './scroll.component.html',
  styleUrls: ['./scroll.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollComponent implements OnInit {
  @Input() template: any;
  @Input() option:{
    handle:any,
    style:any,
    itemHeight:number,
    itemNumber:number,
    pageInit:any
  }
  private cache=[];
  private page=1;
  private itemNumber;
  private heghit;
  private itemHeight;
  private item$=new Subject();
  private pageByManual$ = new BehaviorSubject(1);
  private pageByScroll$;
  private pageByResize$;
  private pageToLoad$;
  private disClear$=new BehaviorSubject(1);
  itemResults$;

  constructor(private service:ScrollService) {
   }

  scrollDataSource(page:number,handle:any){
    return handle(page);
  };
  ngOnInit(){

    this.heghit=this.option.style.height?Number(this.option.style.height.replace('px','')):200;
    this.itemHeight=this.option.itemHeight?this.option.itemHeight:20;
    this.itemNumber=this.option.itemNumber?this.option.itemNumber:10;
    
  }
  // ngOnInit() {  
  //     fromEvent(document.querySelector('#btn'),'click').subscribe(_=>{
  //        console.log('ok');
  //        this.item$.next([]);
  //      });
  // }
  pageInit(){
    this.pageByManual$.next(1);
    this.pageByManual$.next(this.option.pageInit?this.option.pageInit:2);
  }
ngAfterViewInit(): void {
  let dom=document.querySelector('#scr');
  this.pageByScroll$= fromEvent(dom, "scroll").pipe(
    map(() => document.querySelector('#scr').scrollTop),
    debounceTime(100),
    map(y => Math.ceil((y + this.heghit*1.2) / (this.itemHeight * this.itemNumber))),
    distinct(null,this.disClear$)
  );
  this.pageByResize$ = fromEvent(dom, "resize").pipe(
    debounceTime(200),
    map(_ => Math.ceil(
      (this.heghit + dom.scrollTop) /
      (this.itemHeight * this.itemNumber)
    ))
  );
  this.pageToLoad$=merge(this.pageByManual$, this.pageByScroll$, this.pageByResize$).pipe(
    distinct(null,this.disClear$),
    filter(page => this.cache[page - 1] === undefined)
  );
  this.itemResults$ = this.pageToLoad$.pipe(
    mergeMap((page:number)=>{
      let last=this.page;
      if(page-last>1){
         let arry=[];
        for(let i=last+1;i<=page;i++){
          arry.push(i);
        }
         return of(...arry);
      }else {
        return of(page);
        }
       
    }),
    mergeMap((page: number) => {
      return this.scrollDataSource(page,this.option.handle).pipe(
        tap(resp => {
          this.page=page;
          this.cache[page-1]=resp;
        }));
    }), 
    delay(0)
    ); 
    this.itemResults$.subscribe(_=>this.item$.next([].concat(...this.cache)));
    this.pageInit();
    this.service.refresh$.subscribe(handle=>{
      if(handle){
        this.option.handle=handle;
      }
      this.page=1;
      this.cache=[];
      this.item$.next([]);
      this.disClear$.next(1);
      this.pageInit();
    });
} 
}