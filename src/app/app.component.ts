import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { AuthService } from './auth/auth.service';
import { BookingService } from './booking.service';

@Component({
    selector: 'app-root',
    imports: [RouterOutlet, HeaderComponent, FooterComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
    standalone: true
})
export class AppComponent implements OnInit {
  title = 'timeless-sea';

  constructor( private authService: AuthService, private bookingService: BookingService ) {}

  ngOnInit() {
    this.authService.autoLogin()
    this.bookingService.loadBookedDates()
  }

  scrollToTop() {
    window.scroll({ 
            top: 0, 
            left: 0, 
            behavior: 'smooth' 
     });
 }
}
