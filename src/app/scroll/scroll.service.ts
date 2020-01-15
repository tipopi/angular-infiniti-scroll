import { Injectable } from '@angular/core';
import { Subject }    from 'rxjs';

@Injectable()
export class ScrollService {
  private refreshSource=new Subject();
  refresh$=this.refreshSource.asObservable();
  constructor() { }
  refreshData(handle?:any){
    this.refreshSource.next(handle);
  }
}