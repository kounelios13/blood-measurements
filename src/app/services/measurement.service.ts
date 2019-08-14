import { Injectable } from "@angular/core";
import { Measurement } from "../interfaces/measurement";
import { UserService } from "./user.service";
import { of } from "rxjs/internal/observable/of";
import { User } from "../interfaces/user";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root"
})
export class MeasurementService {
  private _dataKey = "data";
  constructor(private userService: UserService, private http: HttpClient) {}
  async getMeasurements(): Promise<Measurement[]> {
    const profile: User = await this.userService.getProfile();
    return profile.records;
  }

  submitMeasurement(measurement: Measurement, userId: string) {
    console.log({ userId, measurement });
    // let data = [...this.getMeasurements(), measurement];
    let url = `${environment.protocol}://${environment.url}:${
      environment.port
    }`;
    if (environment.basePath) {
      url = `${url}/${environment.basePath}`;
    }
    url = `${url}/user/${userId}/records`;
    return this.http
      .post(url, {
        record: measurement
      })
      .toPromise();
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
    const sum = data.reduce(
      (accum, measurement) => accum + (measurement.systolic as number) * 1.0,
      0
    );
    return sum / data.length;
  }

  public calculateAvgDia(data: Measurement[]) {
    const sum = data.reduce(
      (accum, measurement) => accum + (measurement.diastolic as number) * 1.0,
      0
    );
    return sum / data.length;
  }

  public calculateAvgPulses(data: Measurement[]) {
    const sum = data.reduce(
      (accum, measurement) => accum + (measurement.pulses as number) * 1.0,
      0
    );
    return sum / data.length;
  }
  private getUniqueItems(data: any[]) {
    return Array.from(new Set(data));
  }

  private numSorter(a: number, b: number) {
    return a - b;
  }
}
