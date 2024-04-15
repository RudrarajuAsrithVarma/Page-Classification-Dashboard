// data.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
declare var API_URL: string
declare var PDF_API: string

export interface MyData {
  TOTAL_RECORDS: number;
  PAGE_CONTENT: MyDataRow[];
}

export interface MyDataRow {
  [x: string]: any;
  RECORD_ID: string;
  PDF_FILE_NAME: string;
  SCANNED_DATE: string | null;
  PC_MAIN_DOC_ID:any |null;
  COMPLETED_DATE: string | null;
  PAGE_COUNT: number;
  STATUS: string;
  NOTE: string;
  PROC_STAT: string | null;
  PROC_END: string | null;
  PREDICTED_PAGES: number;
  RN: number;
  CONFLICT_PAGES:number;
  ANALYST_ALIAS_FILE_NAME:string | null;
}

export interface MyDetailedData{
  TOTAL_RECORDS: number;
  PAGE_CONTENT: MyDetailedDataRow[];
}
export interface MyDetailedDataRow{
  COMMENTS:string;
  COMPLETED_DATE:string|null;
  CREATED_DATE:string|null;
  //DOC_SIZE:number;
  //IS_DELETED:number;
  //IS_MAIN:number;
  //MODIFIED_DATE:string|null;
  PAGE_COUNT:number;
  PARENT_PC_DOC_ID:any|null;
  PC_DOC_ID:number;
  //PC_MAIN_DOC_ID:number;
  PC_MODEL_VERSION_ID:number;
  //RETRY_COUNT:any|null;
 // START_PAGE_IDX:any|null;
  STATUS:string|null;

}

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}
//API_URL+'/pc_index/'
  getInitialData(currentPage: number): Observable<MyData> {
    const urlinit = API_URL+'/pc_index/';
    
    return this.http.get<MyData>(urlinit+currentPage);
  }

  searchData(
    currentPage: number,
    pageSize: number,
    searchRecordText: any,
    searchFileNameText: any,
    startDate: Date,
    endDate: Date,
    CheckBoxvalue:any
  ): Observable<MyData> {
    const apiUrl = API_URL+'/get_data/';
    const params = {
      RECORD_ID: searchRecordText || null,
      PDF_FILE_NAME: searchFileNameText || null,
      START_DATE: startDate || null,
      END_DATE: endDate || null,
      ONLY_CONFLICTS: CheckBoxvalue
    };

    const body = JSON.stringify(params);
    return this.http.post<MyData>(apiUrl+currentPage, body);
  }

  getConflictData(recordId: string, pcMainDocId: string): Observable<any> {
    const apiUrl = API_URL+`/download-conflicts`;
    const params = {
      record_id: recordId,
      pc_main_doc_id: pcMainDocId,
    };

    return this.http.get(apiUrl, { params, responseType: 'text'  });
  }
  getDetailedData(recordId: string): Observable<MyDetailedData> {
    const apiUrl = '/pc_docs/'; 
    const params = {
      record_id: recordId,
    };
  
    return this.http.get<MyDetailedData>(apiUrl, { params });

  
}

}
