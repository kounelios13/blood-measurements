import { Injectable } from "@angular/core";
import { Measurement } from "../interfaces/measurement";

@Injectable({
  providedIn: "root"
})
export class MeasurementService {
  private _dataKey = "data";
  constructor() {}
  getMeasurements(): Measurement[] {
    let data = JSON.parse(localStorage.getItem(this._dataKey)) || [];
    return data;
  }

  submitMeasurement(measurement: Measurement) {
    let data = [...this.getMeasurements(), measurement];
    localStorage.setItem(this._dataKey, JSON.stringify(data));
  }

  extractYearsFromMeasurements(data: Measurement[]): number[] {
    let years = data.map(i => new Date(i.date).getFullYear());
    //return Array.from(new Set(years)).sort();
    return this.getUniqueItems(years).sort(this.numSorter);
  }

  extractDaysFromMeasurements(data: Measurement[]) {
    let days = data
      .map(item => new Date(item.date).getUTCDate())
      .sort(this.numSorter);
    return this.getUniqueItems(days);
  }

  // Calculate average systolic pressure from a set
  public calculateAvgSys(data: Measurement[]) {
    return (
      data.reduce(
        (accum, measurement) => accum + (measurement.systolic as number),
        0
      ) / data.length
    );
  }

  public calculateAvgDia(data: Measurement[]) {
    return (
      data.reduce(
        (accum, measurement) => accum + (measurement.diastolic as number),
        0
      ) / data.length
    );
  }

  public calculateAvgPulses(data: Measurement[]) {
    return (
      data.reduce(
        (accum, measurement) => accum + (measurement.pulses as number),
        0
      ) / data.length
    );
  }
  private getUniqueItems(data: any[]) {
    return Array.from(new Set(data));
  }

  private numSorter(a: number, b: number) {
    return a - b;
  }
}
