import {InjectionToken} from "@angular/core";

export const NG_TABLE_I18N = new InjectionToken<NgTableI18nService>("NgTableI18nService");

export interface NgTableI18nService{
  formatShowingRows: (from: number, to: number, total: number) => string;
  formatBeforePerPage: () => string;
  formatAfterPerPage: () => string;
  formatSearch: () => string;
  formatAdvancedSearch: () => string;
  formatLoading: () => string;
}
