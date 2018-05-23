import {Injector, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgTableComponent } from './ng-table/ng-table.component';
import { NgTableColComponent } from './ng-table-col/ng-table-col.component';
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import {FormsModule} from "@angular/forms";
import { NgSdTableComponent } from './ng-sd-table/ng-sd-table.component';
import { NgTableGeneralSearchComponent } from './ng-table-general-search/ng-table-general-search.component';
import { TemplateTypePipe } from './template-type.pipe';
import { NgTableToolBarComponent } from './ng-table-tool-bar/ng-table-tool-bar.component';
import {NG_TABLE_I18N, NgTableI18nService} from "./locale/ng-table-i18n.service";
import {NgTableEnUsService} from "./locale/ng-table-en-us.service";

export function ngTableI18nFactory(injector: Injector): NgTableI18nService{
  try{
    return injector.get(NG_TABLE_I18N)
  }catch (e){
    return new NgTableEnUsService();
  }
}


@NgModule({
  imports: [
    CommonModule,
    NgbModule.forRoot(),
    FormsModule
  ],
  declarations: [
    NgTableComponent,
    NgTableColComponent,
    NgSdTableComponent,
    NgTableGeneralSearchComponent,
    TemplateTypePipe,
    NgTableToolBarComponent,
  ],
  exports: [
    NgTableComponent,
    NgTableColComponent,
    NgSdTableComponent,
    NgTableToolBarComponent,
    NgTableGeneralSearchComponent,
  ],
  providers: [
    {provide: NG_TABLE_I18N, useFactory: ngTableI18nFactory, deps: [Injector], multi: false}
  ]
})
export class BsTableModule {

}
