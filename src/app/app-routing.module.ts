import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MeasurementComponent } from "./components/measurement/measurement.component";
import { HistoryComponent } from "./components/history/history.component";
import { LoginComponent } from "./components/login/login.component";

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent
  },
  {
    path: "",
    redirectTo: "new",
    pathMatch: "full"
  },
  {
    path: "new",
    component: MeasurementComponent
  },
  {
    path: "history",
    component: HistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
