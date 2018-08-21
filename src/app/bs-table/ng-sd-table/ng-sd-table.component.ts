import {AfterViewInit, Component, forwardRef, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {NgTableComponent} from "../ng-table/ng-table.component";
import {Page} from "../page";
import {isNullOrUndefined} from "util";
import {HttpParams} from "@angular/common/http";
import * as $ from 'jquery';
import {filter, switchMap, map, combineLatest, tap} from "rxjs/operators";
import {NG_TABLE_TOKEN} from "../ng-table-token";


@Component({
  selector: 'es-ng-sd-table',
  templateUrl: './ng-sd-table.component.html',
  styleUrls: ['./ng-sd-table.component.css'],
  providers: [
    {provide: NG_TABLE_TOKEN, useExisting: forwardRef(() => NgSdTableComponent), multi: false}
  ]
})
export class NgSdTableComponent extends NgTableComponent implements OnInit, AfterViewInit{

  ngOnInit(){
    if(this.keep) this.keepConfigure();


    this.httpSub = this.url$
      .pipe(
        filter((url) => !isNullOrUndefined(url) && Boolean(url)),
        combineLatest(this.params$, (url, params) => {return {url: url, params: params}}),
        tap(() => this.isLoading = true),
        switchMap((connectInfo) => this.http.get<Page<any>>(connectInfo.url, {params: new HttpParams({fromString: $.param(connectInfo.params)})})),
        map((data) => this.responseHandler(data))
      ).subscribe((pageData) => {
        this.data = pageData.rows;
        this.initRows(pageData.rows, pageData.total);
        this.isLoading = false;
      })
  }

  ngAfterViewInit(): void{

  }

}
