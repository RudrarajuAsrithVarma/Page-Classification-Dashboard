import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DxButtonModule } from 'devextreme-angular';
import { DxDataGridModule } from 'devextreme-angular';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { DataGridComponent } from './data-grid/data-grid.component';
import { PopupDialogComponent } from './popup-dialog/popup-dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogModule } from '@angular/material/dialog';




@NgModule({
  declarations: [
    AppComponent,
    DataGridComponent,
    PopupDialogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DxButtonModule,
    DxDataGridModule,
    HttpClientModule,
    FormsModule,
    NgxPaginationModule,
    BrowserAnimationsModule,
    MatDialogModule
    
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
