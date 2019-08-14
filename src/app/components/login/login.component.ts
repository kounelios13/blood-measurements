import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { TokenService } from "src/app/services/token.service";
import { Router } from "@angular/router";
import { MatSnackBar } from "@angular/material";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private router: Router,
    private snackService: MatSnackBar
  ) {}

  ngOnInit() {}

  async submitLogin($event) {
    console.log("performing login request");
    $event.preventDefault();
    try {
      const response = await this.userService.login(this.email, this.password);

      this.tokenService.updateJwt(response.accessToken);
      this.tokenService.updateRefreshToken(response.refreshToken);
      this.router.navigate(["/new"]);
    } catch (e) {
      console.log(e);
      this.snackService.open(e.toString(), null, { duration: 4000 });
    }
  }
}
