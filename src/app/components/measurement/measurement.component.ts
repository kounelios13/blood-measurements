import { Component, OnInit } from "@angular/core";
import { Measurement } from "src/app/interfaces/measurement";
import { MatSnackBar } from "@angular/material";
import { MeasurementService } from "src/app/services/measurement.service";
import { User } from "src/app/interfaces/user";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-measurement",
  templateUrl: "./measurement.component.html",
  styleUrls: ["./measurement.component.scss"]
})
export class MeasurementComponent implements OnInit {
  measurement: Measurement = {
    systolic: 0,
    diastolic: 0,
    pulses: 0,
    id: null,
    date: null
  };
  private profile: User;
  constructor(
    private _snackBar: MatSnackBar,
    private measurementService: MeasurementService,
    private userService: UserService
  ) {}

  async ngOnInit() {
    this.profile = await this.userService.getProfile();
    console.log(this.profile);
  }
  async submitMeasurement(e) {
    console.log("submitting new measurement", this.measurement);
    e.preventDefault();
    try {
      await this.measurementService.submitMeasurement(
        this.measurement,
        this.profile._id
      );
      this._snackBar.open("Submitted new measurement", null, {
        duration: 3000
      });
    } catch (e) {
      this._snackBar.open("Failed to add new measeurment", null, {
        duration: 3000
      });
      console.log(e);
    }
  }

  private uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
