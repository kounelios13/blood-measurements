import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { MeasurementComponent } from "./components/measurement/measurement.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "new",
    pathMatch: "full"
  },
  {
    path: "new",
    component: MeasurementComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
