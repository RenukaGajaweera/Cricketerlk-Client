import { Component, AfterViewInit } from '@angular/core';
import { AuthService } from 'app/services/auth.service';
import { Configurations } from "app/utils/constants";
import { ClkNotificationService } from "app/services/clk-notification.service";

declare var $;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  private userLoggedIn: boolean = false;
  private hideMenu: boolean = false;
  private selectedNav: string = '';
  private adminUser: boolean = false;

  constructor(private authService: AuthService, private notificationService: ClkNotificationService) {

    this.notificationService.showLoader();
    this.authService.getUserObservable().subscribe(res => {
      if (res !== undefined && res !== null) {
        if (res.userRole === 1) {
          this.adminUser = true;
        }
      }
    }, error => {
      console.error(error);
    });

    if (window.location.pathname === '/login') {
      this.hideMenu = true;
    }
    this.setSelectedNav();
  }

  ngAfterViewInit(): void {
    let backgroundImage: string = Configurations.IMAGE_BASE + 'assets/Lords-BG.jpg';
    $('#background').css('background-image', 'url(' + backgroundImage + ')');
    $('#background').css('opacity', '0.5');
  }

  private setSelectedNav() {
    if (window.location.pathname === '/') {
      this.selectedNav = 'HOME';
    } else if (window.location.pathname === '/rules') {
      this.selectedNav = 'RULES';
    } else if (window.location.pathname === '/about-us') {
      this.selectedNav = 'ABOUT';
    } else if (window.location.pathname === '/schedule') {
      this.selectedNav = 'SCHEDULE';
    }
  }

  private navigate(route: string) {
    if (route === 'HOME') {
      window.location.href = '/';
    } else if (route === 'RULES') {
      window.location.href = '/rules';
    } else if (route === 'ABOUT') {
      window.location.href = '/about-us';
    } else if (route === 'ADMIN') {
      window.location.href = '/admin';
    } else if (route === 'SCHEDULE') {
      window.location.href = '/schedule';
    } else {
      window.location.href = '/';
    }
  }

}
