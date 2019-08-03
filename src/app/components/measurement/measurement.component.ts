import { Component, OnInit } from "@angular/core";
import { Measurement } from "src/app/interfaces/measurement";
import { MatSnackBar } from "@angular/material";

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
  constructor(private _snackBar: MatSnackBar) {}

  ngOnInit() {}
  submitMeasurement(e) {
    console.log("submitting new measurement", this.measurement);
    e.preventDefault();
    this.measurement.id = this.uuidv4();
    this.measurement.date = new Date();
    let data = JSON.parse(localStorage.getItem("data")) || [];
    data.push(this.measurement);
    localStorage.setItem("data", JSON.stringify(data));
    this.measurement = {
      systolic: 0,
      diastolic: 0,
      pulses: 0,
      id: null,
      date: null
    };
    this._snackBar.open("Submitted new measurement", null, { duration: 3000 });
  }

  private uuidv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }
}
