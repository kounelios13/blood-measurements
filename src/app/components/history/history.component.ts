import { Component, OnInit } from "@angular/core";
import { Measurement } from "src/app/interfaces/measurement";

@Component({
  selector: "app-history",
  templateUrl: "./history.component.html",
  styleUrls: ["./history.component.scss"]
})
export class HistoryComponent implements OnInit {
  measurements: Measurement[];
  years: string[];
  months: string[];
  days: string[];
  selectedYear: number;
  selectedMonth: number;
  selectedDay: number;

  filteredData: Measurement[];
  constructor() {}

  ngOnInit() {
    let data: Measurement[] = JSON.parse(localStorage.getItem("data"));
    console.log(data);
    this.measurements = data;
    let years = this.measurements.map(m => {
      return new Date(m.date).getFullYear();
    });

    this.years = this.getUniqueItems(years).sort();
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
    console.log({ month: this.selectedMonth, year: this.selectedYear, $event });
    const days = this.measurements
      .filter(m => {
        let date = new Date(m.date);
        let year = date.getFullYear();
        let isSameYear = year == this.selectedYear;
        let month = date.getMonth() + 1;
        let isSameMonth = this.selectedMonth == month;

        return isSameMonth && isSameYear;
      })
      .map(e => new Date(e.date).getUTCDate());
    this.days = this.getUniqueItems(days);
  }

  onDayChange($event) {
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
    this.filteredData = data;
  }
  private getUniqueItems(array: any[]) {
    return Array.from(new Set(array));
  }
}
