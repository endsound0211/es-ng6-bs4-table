import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {BsTableModule} from "./bs-table/bs-table.module";
import {AppRoutingModule} from "./app-routing.module";
import {NG_TABLE_I18N} from "./bs-table/locale/ng-table-i18n.service";
import {NgTableZhTwService} from "./bs-table/locale/ng-table-zh-tw.service";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BsTableModule,
  ],
  providers: [
    // {provide: NG_TABLE_I18N, useClass: NgTableZhTwService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
