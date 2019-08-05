import { Component, OnInit, ViewChild } from "@angular/core";
import { Measurement } from "src/app/interfaces/measurement";
import { ChartComponent } from "angular2-chartjs";
import { Dataset } from "src/app/interfaces/dataset";
import { MeasurementService } from "src/app/services/measurement.service";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"]
})
export class HistoryComponent implements OnInit {
  @ViewChild("mainChart") mainChart: ChartComponent;
  measurements: Measurement[];
  years: string[];
  months: string[];
  days: string[];
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;
  chartType = "bar";
  data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Number of measurements",
        data: []
      }
    ]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false
  };
  filteredData: Measurement[];
  constructor(private measurementService: MeasurementService) {}

  ngOnInit() {
    this.measurements = this.measurementService.getMeasurements();
    let years = this.measurements.map(m => {
      return new Date(m.date).getFullYear();
    });

    this.years = this.measurementService
      .extractYearsFromMeasurements(this.measurements)
      .map(String);
    this.onYearChange({ value: this.years[0] });
  }

  onYearChange($event) {
    console.log($event);
    this.selectedYear = +$event.value;
    const months = this.measurements
      .filter(m => new Date(m.date).getFullYear() == +this.selectedYear)
      .map(m => new Date(m.date).getMonth() + 1);
    this.months = this.getUniqueItems(months).sort();
  }

  onMonthChange($event) {
    this.selectedMonth = +$event.value;
    // Time to find data for selected month and year
    const filteredData = this.measurements.filter(record => {
      let date = new Date(record.date);
      let recordYear = date.getFullYear();
      //Months in JS start from 0.So for example
      // January is 0,February is 1 and so on.
      let recordMonth = date.getMonth() + 1;
      return (
        recordYear == this.selectedYear && recordMonth == this.selectedMonth
      );
    });
    let days = filteredData.map(item => new Date(item.date).getUTCDate());
    // Clear duplicates and sort
    days = Array.from(new Set(days)).sort((a, b) => a - b);
    // This returns a new String object for every item in `days`
    this.days = days.map(String);
    // @TODO
    // we need 3 datasets
    // 1 for average systolic pressure per day
    // 1 for avg diastolic pressure per day
    // 1 for avg num of pulses for each day

    const sysDataSet = {
      label: "Average systolic per day",
      data: [],
      backgroundColor: "yellow"
    };
    const diaDataSet = {
      label: "Average dia per day",
      data: [],
      backgroundColor: "red"
    };

    const pulseDataSet = {
      label: "Average pulses per day",
      data: [],
      backgroundColor: "orange"
    };
    days.forEach(d => {
      console.log(`Day ${d}`);
      const data = this.getMeasurementPerDate(
        this.selectedYear,
        this.selectedMonth,
        d
      );
      console.table(data);
      sysDataSet.data.push(this.measurementService.calculateAvgSys(data));
      diaDataSet.data.push(this.measurementService.calculateAvgDia(data));
      pulseDataSet.data.push(this.measurementService.calculateAvgPulses(data));
    });
    this.data.datasets[0].label = `Total measurements`;
    this.data.labels = days.map(day => `Day : ${day}`);

    // const measurements = [];
    // this.days.forEach(day => {
    //   let results = this.getMeasurementPerDate(
    //     this.selectedYear,
    //     this.selectedMonth,
    //     day
    //   );
    //   console.log({ results });
    //   measurements.push(results.length);
    // });
    const measurements = this.days.map(day => {
      let results = this.getMeasurementPerDate(
        this.selectedYear,
        this.selectedMonth,
        day
      );
      console.log({ results });
      return results.length;
    });
    this.data.datasets = [sysDataSet, diaDataSet, pulseDataSet];
    // this.data.datasets[0].data = measurements;
    this.mainChart.chart.update();
    // console.log({ month: this.selectedMonth, year: this.selectedYear, $event });
    // const days = this.measurements
    //   .filter(m => {
    //     let date = new Date(m.date);
    //     let year = date.getFullYear();
    //     let isSameYear = year == this.selectedYear;
    //     let month = date.getMonth() + 1;
    //     let isSameMonth = this.selectedMonth == month;

    //     return isSameMonth && isSameYear;
    //   })
    //   .map(e => new Date(e.date).getUTCDate());
    // this.days = this.getUniqueItems(days).sort((a, b) => a - b);
    // this.data.datasets[0].label = `Total measurements for month ${
    //   this.selectedMonth
    // } of year ${this.selectedYear}`;
    // this.data.labels = this.days.map(day => `Day : ${day}`);
    // const measurements = [];
    // this.days.forEach(day => {
    //   measurements.push(
    //     this.getMeasurementPerDate(this.selectedYear, this.selectedMonth, day)
    //   );
    // });
    // this.data.datasets[0].data = measurements.map(e => e.length);
    // const dataset = this.generatePerDaySys(measurements);
    // this.data.datasets = [dataset];
    // this.generateSelectedMonthSet();
    // this.mainChart.chart.update();
  }

  getMonthName(month: number) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December"
    ];
    return months[month];
  }
  onDayChange($event) {
    return;
    this.selectedDay = +$event.value;
    const data = this.measurements.filter(m => {
      let date = new Date(m.date);
      let year = date.getFullYear();
      let isSameYear = year == this.selectedYear;
      let month = date.getMonth() + 1;
      let isSameMonth = this.selectedMonth == month;
      let day = date.getUTCDate();
      let isSameDay = this.selectedDay == day;
      return isSameDay && isSameMonth && isSameYear;
    });
    //this.filteredData = data;
  }
  private getUniqueItems(array: any[]) {
    return Array.from(new Set(array));
  }

  private getMeasurementPerDate(year, month, day) {
    return this.measurements.filter(m => {
      let date = new Date(m.date);
      let mDay = date.getUTCDate();
      let mYear = date.getFullYear();
      let mMonth = date.getMonth() + 1;
      return month == mMonth && mDay == day && mYear == year;
    });
  }

  private generatePerDaySys(measurements: Measurement[]): Dataset {
    console.log(measurements, typeof measurements);
    let dataset: Dataset = {
      label: `Per day`,
      data: [1, 8, 0]
    };

    return dataset;
  }

  private generateSelectedMonthSet(): Dataset {
    // Filter data for selected month and year
    let filteredData = this.measurements.filter(m => {
      let date = new Date(m.date);
      let year = date.getFullYear();
      let isSameYear = year == this.selectedYear;
      let month = date.getMonth() + 1;
      let isSameMonth = this.selectedMonth == month;

      return isSameMonth && isSameYear;
    });

    let days = filteredData
      .map(item => new Date(item.date).getUTCDate())
      .sort((a, b) => a - b);
    console.log({ days: Array.from(new Set(days)) });
    let dataset: Dataset = {
      label: `No of measurements for ${this.getMonthName(
        this.selectedMonth - 1
      )}`,
      data: []
    };
    // dataset.data = filteredData.map(item=>{

    // });
    return dataset;
  }
}
