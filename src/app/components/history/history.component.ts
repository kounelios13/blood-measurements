import { Component, OnInit, ViewChild } from "@angular/core";
import { Measurement } from "src/app/interfaces/measurement";
import { ChartComponent } from "angular2-chartjs";
import { Dataset } from "src/app/interfaces/dataset";
import { MeasurementService } from "src/app/services/measurement.service";
import { MatSelectChange, MatSnackBar } from "@angular/material";

import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"]
})
export class HistoryComponent implements OnInit {
  //@ViewChild("mainChart") mainChart: ChartComponent;
  @ViewChild("sysChart") sysChart: ChartComponent;
  @ViewChild("diaChart") diaChart: ChartComponent;
  @ViewChild("pulsesChart") pulsesChart: ChartComponent;
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
  sysChartData = {
    labels: [],
    datasets: [
      {
        label: "Average systolic per day",
        data: []
      }
    ]
  };
  diaChartData = {
    labels: [],
    datasets: [
      {
        label: "Average diastolic per day",
        data: []
      }
    ]
  };
  pulsesChartData = {
    labels: [],
    datasets: [{ label: "Average pulses per day", data: [] }]
  };
  options = {
    responsive: true,
    maintainAspectRatio: false
  };
  filteredData: Measurement[];
  constructor(
    private measurementService: MeasurementService,
    private point: BreakpointObserver,
    private snack: MatSnackBar
  ) {}

  ngOnInit() {
    // Will implement update mechanism for chart type in another branch(probably)
    let chartType = localStorage.getItem("chartType");
    if (chartType) {
      this.chartType = chartType;
    }
    this.sysChartData.labels = [];
    this.measurements = this.measurementService.getMeasurements();
    let years = this.measurements.map(m => {
      return new Date(m.date).getFullYear();
    });

    this.years = this.measurementService
      .extractYearsFromMeasurements(this.measurements)
      .map(String);

    let curDate = new Date();
    let year = curDate.getFullYear().toString();
    let month = curDate.getMonth() + 1;
    let changeEvent = {
      value: this.years.includes(year) ? year : this.years[0]
    };
    this.onYearChange(changeEvent);
    // After gathering all data for our current year let's see what month we have to diplay data for
    // const month = new Date().getMonth() + 1;
    let monthEvent = { value: null };
    if (this.months.includes(month.toString())) {
      monthEvent.value = month;
    } else {
      monthEvent.value = this.months[0];
    }
    //this.onMonthChange(monthEvent);
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
    console.log($event);
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
    const measurements = [];
    days.forEach(d => {
      //console.log(`Day ${d}`);
      const data = this.getMeasurementPerDate(
        this.selectedYear,
        this.selectedMonth,
        d
      );
      //console.table(data);
      measurements.push(data.length);
      sysDataSet.data.push(this.measurementService.calculateAvgSys(data));
      diaDataSet.data.push(this.measurementService.calculateAvgDia(data));
      pulseDataSet.data.push(this.measurementService.calculateAvgPulses(data));
    });
    this.data.labels = this.sysChartData.labels = this.diaChartData.labels = days.map(
      day => `Day : ${day}`
    );
    this.pulsesChartData.labels = this.data.labels;
    this.data.datasets = [sysDataSet, diaDataSet, pulseDataSet];
    this.sysChartData.datasets = [sysDataSet];
    this.diaChartData.datasets = [diaDataSet];
    this.pulsesChartData.datasets = [pulseDataSet];
    // this.data.datasets[0].data = measurements;
    //this.mainChart.chart.update();
    this.sysChart.chart.update();
    this.diaChart.chart.update();
    this.pulsesChart.chart.update();
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
}
