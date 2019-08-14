import { Component, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.scss"]
})
export class LoginComponent implements OnInit {
  email: string;
  password: string;
  constructor(private userService: UserService) {}

  ngOnInit() {}

  async submitLogin($event) {
    console.log("performing login request");
    $event.preventDefault();
    try {
      const response: any = await this.userService.login(
        this.email,
        this.password
      );
      console.log(response);
      const payload = {
        accessToken: response.accessToken,
        refreshToken: response.refreshToken
      };
      localStorage.setItem("tokens", JSON.stringify(payload));
    } catch (e) {
      console.log(e);
    }
  }
}
