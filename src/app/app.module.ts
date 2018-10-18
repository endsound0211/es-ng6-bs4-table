import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import {BsTableModule} from 'es-ng-bs-table';
import {AppRoutingModule} from './app-routing.module';
import {FormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BsTableModule,
    FormsModule
  ],
  providers: [
    // {provide: NG_TABLE_I18N, useClass: NgTableZhTwService}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
