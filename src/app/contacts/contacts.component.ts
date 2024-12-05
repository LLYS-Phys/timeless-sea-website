import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { EmailJsType } from './contacts.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss'
})
export class ContactsComponent {
  constructor(private http: HttpClient, private destroyRef: DestroyRef, private sanitizer: DomSanitizer){}

  credentials: EmailJsType = {public_key: '', template_id: '', service_id: ''}

  email_sent: boolean = false
  googleMapsUrl: SafeUrl | null = null;

  emailForm = new FormGroup({
    name: new FormControl({value: '', disabled: this.email_sent}, [Validators.required]),
    email: new FormControl({value: '', disabled: this.email_sent}, [Validators.required, Validators.email]),
    message: new FormControl({value: '', disabled: this.email_sent}, [Validators.required])
  })

  get buttonStatus() {
    return this.emailForm.status == "VALID" ? false : true
  }

  private fetchEmailjsCredentials () {
    return this.http.get<EmailJsType>('https://timeless-sea-default-rtdb.europe-west1.firebasedatabase.app/emailjs.json')
  }

  private fetchGoogleMapsApiKey () {
    return this.http.get<{api_key: string}>('https://timeless-sea-default-rtdb.europe-west1.firebasedatabase.app/googlemaps.json')
  }

  ngOnInit() {
    const googleMapsCredential = this.fetchGoogleMapsApiKey().subscribe({
      next: (data) => {
        this.googleMapsUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.google.com/maps/embed/v1/place?key=" + data.api_key + "&q=Петрова+нива+16+Царево")
      },
      error: (err) => console.log(err)
    })

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

    this.destroyRef.onDestroy(() => {
      credentialsSubscription.unsubscribe()
      googleMapsCredential.unsubscribe()
    })
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
          this.email_sent = true
          this.emailForm.disable()
        },
        (error: any) => {
          console.log('FAILED...', (error as EmailJSResponseStatus).text);
        },
      );
  }
}
