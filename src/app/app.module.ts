import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { ChartModule } from "angular2-chartjs";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NavbarComponent } from "./navbar/navbar.component";
import { LayoutModule } from "@angular/cdk/layout";
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatCardModule,
  MatFormField,
  MatFormFieldModule,
  MatInputModule,
  MatSnackBarModule,
  MatSelectModule,
  MatOptionModule,
  MatGridListModule
} from "@angular/material";
import { MeasurementComponent } from "./components/measurement/measurement.component";
import { FormsModule } from "@angular/forms";
import { HistoryComponent } from "./components/history/history.component";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    MeasurementComponent,
    HistoryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    LayoutModule,
    ChartModule,
    MatCardModule,
    MatSnackBarModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatListModule,
    FormsModule,
    MatSelectModule,
    MatGridListModule,
    MatOptionModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
