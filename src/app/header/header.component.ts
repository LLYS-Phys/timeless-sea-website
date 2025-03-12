import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'header[customHeader]',
    imports: [RouterLink, MatIconModule, MatButtonModule, CommonModule],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  mobile_menu_opened: boolean = false

  toggleMobileMenu(event: Event) {
    event.stopPropagation()
    this.mobile_menu_opened = !this.mobile_menu_opened
  }

  ngOnInit() {
    window.addEventListener("click", () => {
      if (this.mobile_menu_opened) this.mobile_menu_opened = false
    })
  }
}
