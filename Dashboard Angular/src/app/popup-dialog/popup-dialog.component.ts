//popup-dialog.component.ts
import { Component, Inject, } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MyDetailedData,MyDetailedDataRow,MyDataRow } from '../data-service.service';
import { DataService, } from '../data-service.service';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-popup-dialog',
  templateUrl: './popup-dialog.component.html',
  styleUrls: ['./popup-dialog.component.css'],
})
export class PopupDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<PopupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { recordId: string }, 
    private dataService: DataService
  ) {}
  fetchedData: MyDetailedData | null = null;
  currentPage:number=1;
  dataSource: MyDetailedDataRow[] = [];
  gridColumns: any[] = [];
  pageSize: number = 20;
  totalItems: number = 0;
  totalPages:number=0;
  isGridLoading:boolean=false;
  goToPageNumber!: number | null;

  startIndex = (this.currentPage - 1) * this.pageSize;
  endIndex = this.startIndex + this.pageSize;
  
  recordId: string = '';
  pcMainDocId:any;
  analystname!: string | null;
  detailedData: MyDataRow | undefined;

  ngOnInit(): void {
    this.gridColumns = [
      {dataField:'PC_DOC_ID',
      width:150},
      { dataField: 'PARENT_PC_DOC_ID',width:150},
      { dataField: 'CREATED_DATE',width:130},
      {
        dataField: 'COMPLETED_DATE',
        allowEditing: true,
        width:130
      },
      {dataField:'PAGE_COUNT',width:120},
      {dataField:'STATUS',width:120},
      {
        dataField: 'COMMENTS',
        cellStyle: { color: 'lightblue' },
        width:120
      },
      {dataField:'PC_MODEL_VERSION_ID',width:120},
      
    ];
    this.fetchData();
    this.totalPages = Math.ceil(this.totalItems / this.pageSize);
  }

  fetchData(): void {

    this,this.isGridLoading=true;
    const recordId = this.data.recordId;
    console.log(this.isGridLoading)
    this.dataService.getDetailedData(recordId).subscribe(
      (data:MyDetailedData) => {
        console.log('Detailed Data:', data);
        this.dataSource=data.PAGE_CONTENT;
        console.log('1',this.isGridLoading)
        this.totalItems=data.TOTAL_RECORDS;
        this.isGridLoading=false;console.log(this.isGridLoading);
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
    console.log(this.isGridLoading)
  }
  
  

  closeDialog(): void {
    this.dialogRef.close();
  }
}
