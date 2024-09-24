import { Component } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  public sendEmail(e: Event) {
    e.preventDefault();

    emailjs
      .sendForm('service_zoo53hi', 'template_usamvtl', e.target as HTMLFormElement, {
        publicKey: 'LPAjwHkkePZIBgOue',
      })
      .then(
        () => {
          console.log('SUCCESS!');
        },
        (error: any) => {
          console.log('FAILED...', (error as EmailJSResponseStatus).text);
        },
      );
  }
}
