import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { MatSnackBar } from "@angular/material";
import { Router } from "@angular/router";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"]
})
export class RegisterComponent implements OnInit {
  email: string;
  password: string;
  passwordConfirm: string;
  constructor(
    private router: Router,
    private userService: UserService,
    private snackService: MatSnackBar
  ) {}

  ngOnInit() {}

  async submitRegister($event) {
    $event.preventDefault();
    try {
      await this.userService.register(
        this.email,
        this.password,
        this.passwordConfirm
      );
      this.router.navigate(["/login"]);
      this.snackService.open(
        "You have been registered.You can now login",
        null,
        { duration: 4000 }
      );
    } catch (e) {
      this.snackService.open(e.message ? e.message : e.toString(), null, {
        duration: 4000
      });
    }
  }
}
