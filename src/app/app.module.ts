import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from "@angular/common/http";
import {BsTableModule} from "./bs-table/bs-table.module";

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    BsTableModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
