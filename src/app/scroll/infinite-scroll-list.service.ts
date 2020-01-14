import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable,merge,pipe,fromEvent,of } from 'rxjs';
import { map, filter, debounceTime, distinct, mergeMap, tap} from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InfiniteScrollListService {
  private cache = [];
  private pageByManual$ = new BehaviorSubject(1);
  private itemHeight = 40;
  private numberOfItems = 10;
  private dataSource$;
  private pageByScroll$ = fromEvent(window, 'scroll').pipe(
    map(() => window.scrollY),
    filter(current => current >= document.body.clientHeight - window.innerHeight),
    debounceTime(200),
    distinct(),
    map(y => Math.ceil((y + window.innerHeight) / (this.itemHeight * this.numberOfItems)))
  );


  private pageByResize$ = fromEvent(window, "resize").pipe(
    debounceTime(200),
    map(_ => Math.ceil(
      (window.innerHeight + document.body.scrollTop) /
      (this.itemHeight * this.numberOfItems)
    ))
  );

  private pageToLoad$ = merge(this.pageByManual$, this.pageByScroll$, this.pageByResize$).pipe(
    distinct(),
    filter(page => this.cache[page - 1] === undefined)
  );

  itemResults$ = this.pageToLoad$.pipe(
    mergeMap((page: number) => {
      return this.dataSource$.pipe(
        tap(resp => {
          this.cache[page - 1] = resp;
          if ((this.itemHeight * this.numberOfItems * page) < window.innerHeight) {
            this.pageByManual$.next(page + 1);
          }
        }));
    }));

  constructor(private http: HttpClient) {
  }

  public getItemObservable(dataSource: Observable<any>) {
    this.dataSource$ = dataSource;
    return this.itemResults$;
  }
  public getItemObservableSet(dataSource: Observable<any>,itemHeight:number,itemNumber:number) {
    this.itemHeight=itemHeight;
    this.numberOfItems=itemNumber;
    return this.getItemObservable(dataSource);
  }

  public setPage(page:number){
    this.pageByManual$.next(page);
  }
}
