import { Component, DestroyRef, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { RouterLink } from '@angular/router';
import { LoginComponent } from '../login/login.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [RouterLink, LoginComponent],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  constructor( private authService: AuthService, private destroyRef: DestroyRef ){}

  isAuthenticated = false

  ngOnInit() {
    const userSubscription = this.authService.user.subscribe({
      next: (user) => {
        this.isAuthenticated = !!user
      }
    })

    this.destroyRef.onDestroy(() => userSubscription.unsubscribe())
  }

  onLogout() {
    this.authService.logout()
  }

}
