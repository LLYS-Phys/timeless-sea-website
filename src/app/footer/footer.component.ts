import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'footer[customFooter]',
    imports: [RouterLink],
    templateUrl: './footer.component.html',
    styleUrl: './footer.component.scss'
})
export class FooterComponent {

}
