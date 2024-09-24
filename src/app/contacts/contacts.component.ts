import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { EmailJsType } from './contacts.model';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  constructor(private http: HttpClient, private destroyRef: DestroyRef){}

  credentials: EmailJsType = {public_key: '', template_id: '', service_id: ''}

  private fetchEmailjsCredentials () {
    return this.http.get<EmailJsType>('https://timeless-sea-default-rtdb.europe-west1.firebasedatabase.app/emailjs.json')
  }

  ngOnInit() {
    const credentialsSubscription = this.fetchEmailjsCredentials().subscribe({
      next: (data) => {
        this.credentials!.public_key = data.public_key
        this.credentials!.service_id = data.service_id
        this.credentials!.template_id = data.template_id
      },
      error: (err) => {
        console.log(err)
      }
    })

    this.destroyRef.onDestroy(() => credentialsSubscription.unsubscribe())
  }

  public sendEmail(e: Event) {
    e.preventDefault();

    emailjs
      .sendForm(this.credentials!.service_id, this.credentials!.template_id, e.target as HTMLFormElement, {
        publicKey: this.credentials!.public_key,
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
