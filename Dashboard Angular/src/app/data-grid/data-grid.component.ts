
// app.component.ts

import { Component, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DxDataGridComponent } from 'devextreme-angular';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { DataService, MyData, MyDataRow } from '../data-service.service';
import { DatePipe } from '@angular/common';
import { saveAs } from 'file-saver';
declare var PDF_API:string
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PopupDialogComponent } from '../popup-dialog/popup-dialog.component'; 
import { MyDetailedData } from '../data-service.service'; 


@Component({
  selector: 'app-data-grid',
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.css'],
  providers: [DatePipe]
})
export class DataGridComponent {

  message!: MyData;
  dataSource: MyDataRow[] = [];
  gridColumns: any[] = [];
  currentPage: number = 1;
  pageSize: number = 20;
  totalItems: number = 0;
  startIndex = (this.currentPage - 1) * this.pageSize;
  endIndex = this.startIndex + this.pageSize;
  searchRecordText: any;
  searchFileNameText: any;
  recordId!: number;
  filename!: any;
  startDate!: Date;
  endDate!: Date;
  totalPages: number = 0;
  goToPageNumber!: number | null;
  errorMessage: string = '';
  isLoading: boolean = false;
  sendGc: boolean = false;
  GET_CONFLICT:any;
  Link!: any;
  showGrid: boolean = true;
  @ViewChild(DxDataGridComponent, { static: false }) dataGrid!: DxDataGridComponent;

  constructor(private http: HttpClient, private dataService: DataService, private datePipe: DatePipe,private dialog: MatDialog) {}

  ngOnInit() {
    
  
  
  this.loadIntialData();
 
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
    this.gridColumns = [
      {
        dataField: 'RECORD_ID',
        cellStyle: { color: 'lightblue' },
        cellTemplate: 'recordidTemplate',
        width:78
      },
      /*{
        dataField: 'PC_MAIN_DOC_ID',
        cellTemplate: 'customCellTemplatePcMain',
        cssClass: "custom"
      },*/,
      {
        dataField: 'PDF_FILE_NAME',
        cellTemplate:'customCellTemplatePdfFile',
        allowEditing: true,
        width:130
      },
      //{ dataField: 'PAGE_COUNT' },
      { dataField: 'SCANNED_DATE' ,width:130},
      { dataField: 'PROC_STAT',caption:'PROCESS START',width:140 },
      { dataField: 'PROC_END', caption:'PROCESS END',width:140},
      { dataField: 'COMPLETED_DATE' ,width:140},
      //{ dataField: 'PREDICTED_PAGES' },
      { dataField: 'STATUS',width:58 },
      {dataField:'ANALYST_ALIAS_FILE_NAME',caption:'ANALYST NAME',width:120},
      { dataField: 'NOTE',caption:'ANALYST NOTE',width:150},
      {dataField:'PAGES_PREDICTED',caption:'PREDICTED/TOTAL - (CONFLICTS)', cellTemplate: 'pagespredictedTemplate',width:150}
    ];
  }

  loadIntialData() {
    this.isLoading = true;
    this.dataService.getInitialData(this.currentPage).subscribe(
      (data: MyData) => {
        console.log("data");
        this.dataSource = data.PAGE_CONTENT;
        if(this.currentPage==1){
        this.totalItems = data.TOTAL_RECORDS; 
        console.log('Only on Current Page 1 pc Index',this.totalItems)
        }
        console.log(this.currentPage,this.totalItems);
        this.totalPages=Math.ceil(this.totalItems/this.pageSize);
        
        this.dataSource.forEach((row) => {
          row.SCANNED_DATE = this.formatDate(row.SCANNED_DATE);
          row.COMPLETED_DATE = this.formatDate(row.COMPLETED_DATE);
          row.PROC_STAT = this.formatDate(row.PROC_STAT);
          row.PROC_END = this.formatDate(row.PROC_END);
        });
        console.log(this.dataSource);
        this.isLoading = false;
      },
      (error) => {
        this.isLoading=false;
        alert('ERROR PLEASE TRY AGAIN');
      }
    );
  }

  loadData() {
    this.isLoading = true;
    this.errorMessage = ''; 
    //this.dataSource = []; 
    this.dataService
      .searchData(
        this.currentPage,
        this.pageSize,
        this.searchRecordText,
        this.searchFileNameText,
        this.startDate,
        this.endDate,
        this.GET_CONFLICT,
      )
      .subscribe(
        (data: MyData) => {
      
           {
            this.dataSource = data.PAGE_CONTENT;
            if(this.currentPage==1){
            this.totalItems = data.TOTAL_RECORDS;
            console.log('Only on Current Page 1 GET DATA',this.totalItems)
            }
            console.log(this.currentPage,this.totalItems);


            this.totalPages = Math.ceil(this.totalItems / this.pageSize);
            
            this.dataSource.forEach((row) => {
              row.SCANNED_DATE = this.formatDate(row.SCANNED_DATE);
              row.COMPLETED_DATE = this.formatDate(row.COMPLETED_DATE);
              row.PROC_STAT = this.formatDate(row.PROC_STAT);
              row.PROC_END = this.formatDate(row.PROC_END);
            });
            console.log(this.dataSource);
          }
          this.isLoading = false;
        },
        (error) => {
          this.isLoading = false;
          
          if (error.status === 404) {
            //alert(this.message);
            this.errorMessage = error.error.MESSAGE;
            alert(this.errorMessage);
          } else {
            alert('Error occurred while fetching data. Please try again.');
          }
        }
      );
  }
  
  
  onPageChange(event: number) {
    this.currentPage = event;
    this.startIndex = (this.currentPage - 1) * this.pageSize;
    this.endIndex = this.startIndex + this.pageSize;
    if (
      !this.searchRecordText &&
      !this.searchFileNameText &&
      !this.startDate &&
      !this.endDate
    ){
      
    this.loadIntialData();
  }
  else{
    this.loadData();
  }}

  getURLForPCMainDocID(cellData: any): any {
    const pdfFileName = cellData.value;

  return PDF_API + pdfFileName;

  }

  search() {
    if (this.sendGc) {
      this.GET_CONFLICT=1;
    }
    else{
      this.GET_CONFLICT=0;
    }

    if (
      !this.searchRecordText &&
      !this.searchFileNameText &&
      !this.startDate &&
      !this.endDate &&
      this.GET_CONFLICT==0
    ) {
      alert('Please choose at least one input to search.');
      this.currentPage=1;
      this.loadIntialData();
    } else if (this.searchRecordText && isNaN(this.searchRecordText)) {
      alert('Please enter a valid number for the Record ID.');
    } else {
      this.currentPage=1;
      this.loadData();
    }
    
  }

  goToPage() {
    if (this.goToPageNumber !== null) {
      if (this.goToPageNumber > 0 && this.goToPageNumber <= this.totalPages && !this.searchRecordText &&
          !this.searchFileNameText && !this.startDate && !this.endDate) {
        this.currentPage = this.goToPageNumber;
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = this.startIndex + this.pageSize;
        this.loadIntialData();
      } else if (this.goToPageNumber > 0 && this.goToPageNumber <= this.totalPages) {
        this.currentPage = this.goToPageNumber;
        this.startIndex = (this.currentPage - 1) * this.pageSize;
        this.endIndex = this.startIndex + this.pageSize;
        this.loadData();
      } else {
        alert('Invalid page number. Please enter a valid page number.');
      }
    } else {
      alert('Please enter a valid page number.');
    }
  }

  isSubDocAbandoned(cellData: any): any {
    return cellData.row.data.ABANDON_SUB_DOC_COUNT !== 0;
  }

  isLessThan(cellData: any): boolean {
    return cellData.row.data.PREDICTED_PAGES < cellData.row.data.PAGE_COUNT;
  }
  

  onHoverAbondoned(cellData: any): string {
    const rowData = cellData.row.data;
    const isAbandoned = this.isSubDocAbandoned(cellData);
    const abandonedCount = isAbandoned ? rowData.ABANDON_SUB_DOC_COUNT : 0;
    return isAbandoned
      ? `ABANDON_SUB_DOC_COUNT: ${abandonedCount}`
      : rowData.PDF_FILE_NAME;
  }

  onHoverPcMainDoc(cellData: any): string {
    const rowData = cellData.row.data;
    const pc_main_doc_id = true ? rowData.PC_MAIN_DOC_ID : 0;
    return true
      ? `PC_MAIN_DOC_ID: ${pc_main_doc_id}`
      : rowData.PDF_FILE_NAME;
  }
  showheader(cellData: any): string{

    return true
      ? `PC_MAIN_DOC_ID`
      : '';

  }

  onSendGcChange() {
    if (this.sendGc) {
      this.GET_CONFLICT=1;
      this.loadData();
    }
  }
  
  onConflictNumberClick(rowData: MyDataRow) {
    this.dataService.getConflictData(rowData.RECORD_ID, rowData.PC_MAIN_DOC_ID).subscribe(
      (response) => {
        console.log('API response:', response);
        const blob = new Blob([response], { type: 'application/json' });
        const fileName = 'downloaded_file.json';
        saveAs(blob, fileName);
      },
      (error) => {
        console.error('API error:', error);
      }
    );
  }

  private formatDate(dateString: string | null): string | null {
    if (!dateString) {
      return null;
    }
  
    const datePart = dateString.split(',')[1].trim();
    const date = new Date(datePart);
    const utcTime = date.getTime();
    const localDate = new Date(utcTime + date.getTimezoneOffset() * 60000);
  
    return this.datePipe.transform(localDate, 'dd-MMM-yyyy HH:mm:ss') || '';
  }

  openRecordPopup(recordData: MyDataRow): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '80%';
    dialogConfig.height = '60%';
    dialogConfig.data = { recordId: recordData.RECORD_ID };
  
    this.dialog.open(PopupDialogComponent, dialogConfig);
  }
  
  

 
  
  
}
