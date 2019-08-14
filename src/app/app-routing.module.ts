import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MeasurementComponent } from "./components/measurement/measurement.component";
import { HistoryComponent } from "./components/history/history.component";
import { LoginComponent } from "./components/login/login.component";
import { AuthGuard } from "./guards/auth.guard";

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
    canActivate: [AuthGuard],
    path: "new",
    component: MeasurementComponent
  },
  {
    canActivate: [AuthGuard],
    path: "history",
    component: HistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
