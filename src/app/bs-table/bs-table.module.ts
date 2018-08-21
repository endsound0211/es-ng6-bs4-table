import {InjectFlags, Injector, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgTableComponent } from './ng-table/ng-table.component';
import { NgTableColComponent } from './ng-table-col/ng-table-col.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FormsModule} from '@angular/forms';
import { NgSdTableComponent } from './ng-sd-table/ng-sd-table.component';
import { NgTableGeneralSearchComponent } from './ng-table-general-search/ng-table-general-search.component';
import { TemplateTypePipe } from './template-type.pipe';
import { NgTableToolBarComponent } from './ng-table-tool-bar/ng-table-tool-bar.component';
import {NG_TABLE_I18N, NgTableI18nService} from './locale/ng-table-i18n.service';
import {NgTableEnUsService} from './locale/ng-table-en-us.service';
import { NgTableAdvancedSearchComponent } from './ng-table-advanced-search/ng-table-advanced-search.component';
import { NgTableHideColComponent } from './ng-table-hide-col/ng-table-hide-col.component';

export function ngTableI18nFactory(injector: Injector): NgTableI18nService {
  return injector.get(NG_TABLE_I18N, new NgTableEnUsService(), InjectFlags.SkipSelf);
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
    NgTableAdvancedSearchComponent,
    NgTableHideColComponent,
  ],
  exports: [
    NgTableComponent,
    NgTableColComponent,
    NgSdTableComponent,
    NgTableToolBarComponent,
    NgTableGeneralSearchComponent,
    NgTableAdvancedSearchComponent,
    NgTableHideColComponent
  ],
  providers: [
    {provide: NG_TABLE_I18N, useFactory: ngTableI18nFactory, deps: [Injector], multi: false}
  ]
})
export class BsTableModule {

}
