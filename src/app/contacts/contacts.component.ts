import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, ViewChild } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { EmailJsType } from './contacts.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, ReactiveFormsModule, Validators, ValidatorFn, ValidationErrors, AbstractControl } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import * as ical from "node-ical";
import { PricesType } from './prices.model'
import { CustomDateAdapter } from './native_date_adapter';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'bg-BG'}, {provide: DateAdapter, useClass: CustomDateAdapter}, provideNativeDateAdapter()]
})
export class ContactsComponent {
  @ViewChild('pickerEndDate') pickerEndDate!: MatDatepicker<any>
  constructor(private http: HttpClient, private destroyRef: DestroyRef, private sanitizer: DomSanitizer){}

  credentials: EmailJsType = {public_key: '', template_id: '', service_id: ''}

  email_sent: boolean = false
  email_failed: boolean = false
  form_submitting: boolean = false
  googleMapsUrl: SafeUrl | null = null;
  bookedDates: Date[] = []
  bookedDatesFilter: any
  endDateFilter: any | null = null
  reservationInfo: string = ''
  anyDatesAvailable: boolean = true
  prices: PricesType | null = null
  calculatedPrice: string | null = null

  emailForm = new FormGroup({
    name: new FormControl({value: '', disabled: this.email_sent}, [Validators.required]),
    email: new FormControl({value: '', disabled: this.email_sent}, [Validators.required, Validators.email]),
    phone: new FormControl({value: '', disabled: this.email_sent}, [Validators.required, Validators.pattern(/^\+?\d{5,}$/)]),
    start_date: new FormControl({value: '', disabled: this.email_sent}, [Validators.required]),
    end_date: new FormControl({value: '', disabled: true}, [Validators.required]),
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

  private fetchPrices () {
    return this.http.get<PricesType>('https://timeless-sea-default-rtdb.europe-west1.firebasedatabase.app/prices.json')
  }

  private fetchBooking() {
    return this.http.get('http://localhost:3000/api/booking-calendar', {
      responseType: 'text'  // This is crucial
    });
  }

  private fetchAirBnb() {
    return this.http.get('http://localhost:3000/api/airbnb-calendar', {
      responseType: 'text'  // This is crucial
    });
  }

  ngOnInit() {
    if (localStorage.getItem("reservationSent")) {
      this.email_failed = false
      this.email_sent = true
      this.emailForm.disable()
      this.reservationInfo = localStorage.getItem("reservationSent")!
    }
    else {
      const bookedDatesSubscription = this.fetchBooking().subscribe({
        next: (icalDataBooking: string) => {
          try {
            const eventsBooking = ical.sync.parseICS(icalDataBooking);
            Object.values(eventsBooking).filter(event => event.type === 'VEVENT').forEach((el) => {
              for (let i = el.start; i <= el.end; i.setDate(i.getDate() + 1)) {
                this.bookedDates.push(new Date(i))
              }
            })
          } catch (error) {
            console.error('Error parsing iCal data:', error);
          }
        },
        complete: () => {
          this.fetchAirBnb().subscribe({
            next: (icalDataAirBnb: string) => {
              try {
                const eventsAirBnb = ical.sync.parseICS(icalDataAirBnb);
                Object.values(eventsAirBnb).filter(event => event.type === 'VEVENT').forEach((el) => {
                  for (let i = el.start; i <= el.end; i.setDate(i.getDate() + 1)) {
                    this.bookedDates.push(new Date(i))
                  }
                })
              } catch (error) {
                console.error('Error parsing iCal data:', error);
              }       
            },
            complete: () => {
              this.bookedDatesFilter = (d: Date | null): boolean => {
                if (!d) return false; // Prevent null errors
                const today = new Date();
                today.setHours(0, 0, 0, 0); // Reset time to ensure accurate comparison
                // Disable if the date is in the past OR in the booked dates
                return d >= today && !this.bookedDates.some(testDate => testDate.toDateString() === d.toDateString());
              };  
            },
            error: (err) => console.error('Error fetching iCal data:', err)
          });      
        },
        error: (err) => console.error('Error fetching iCal data:', err)
      });

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

      const pricesSubscription = this.fetchPrices().subscribe({
        next: (data) => {
          this.prices = data
        },
        error: (err) => console.log(err)
      })

      this.destroyRef.onDestroy(() => {
        credentialsSubscription.unsubscribe()
        bookedDatesSubscription.unsubscribe()
        pricesSubscription.unsubscribe()
      })
    }

    const googleMapsCredential = this.fetchGoogleMapsApiKey().subscribe({
      next: (data) => {
        this.googleMapsUrl = this.sanitizer.bypassSecurityTrustResourceUrl("https://www.google.com/maps/embed/v1/place?key=" + data.api_key + "&q=Петрова+нива+16+Царево")
        document.querySelector("#google-map")?.addEventListener("load", () => {
          setTimeout(() => {
            document.querySelector("#maps-loader")?.classList.remove("loading")
          }, 500);
        })
      },
      error: (err) => console.log(err)
    })

    this.destroyRef.onDestroy(() => {
      googleMapsCredential.unsubscribe()
    })
  }

  public endDateSelected() {
    this.pickerEndDate.startAt = this,this.emailForm.controls.end_date.valid ? this.emailForm.controls.end_date.value : this.emailForm.controls.start_date.value
    this.calculatedPrice = '100'
  }

  public checkIfEndDateReady() {
    const startDate = this.emailForm.controls.start_date.value;
  
    if (this.emailForm.controls.start_date.valid && startDate) {
      this.emailForm.controls.end_date.enable();
  
      // Ensure the end date picker opens on the selected month
      this.pickerEndDate.startAt = startDate;
  
      // Calculate the minimum selectable end date (3 days after start date)
      const minEndDate = new Date(startDate);
      minEndDate.setDate(minEndDate.getDate() + 3);
  
      // Find the first disabled date after the minEndDate
      let maxEndDate: Date | null = null;
      for (let i = new Date(minEndDate); ; i.setDate(i.getDate() + 1)) {
        if (!this.bookedDatesFilter(i)) {
          maxEndDate = new Date(i);
          break;
        }
      }
  
      // Define the endDateFilter
      this.endDateFilter = (d: Date | null): boolean => {
        if (!d) return false;
        return d >= minEndDate && (maxEndDate ? d < maxEndDate : true);
      };
      
      let hasAvailableDates = false;
      const currentDate = new Date(minEndDate);      
      while (maxEndDate ? currentDate < maxEndDate : currentDate <= new Date(minEndDate.getTime() + (30 * 24 * 60 * 60 * 1000))) {
        if (this.endDateFilter(currentDate)) {
          hasAvailableDates = true
          // Open the end date picker
          this.pickerEndDate.open();
          break;
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      this.anyDatesAvailable = hasAvailableDates;
      if (!hasAvailableDates) {
        this.emailForm.controls.end_date.patchValue('')
        this.emailForm.controls.end_date.disable()
      }
    } else {
      this.emailForm.controls.end_date.disable();
    }
  }  

  public sendEmail(e: Event) {
    e.preventDefault();
    this.form_submitting = true;
    emailjs
      .sendForm(this.credentials!.service_id, this.credentials!.template_id, e.target as HTMLFormElement, {
        publicKey: this.credentials!.public_key,
      })
      .then(
        () => {
          this.email_failed = false
          this.email_sent = true
          this.form_submitting = false
          this.emailForm.disable()
          localStorage.setItem("reservationSent", ` за периода от ${new Date(this.emailForm.controls.start_date.value!).toLocaleDateString("bg-BG")} до ${new Date(this.emailForm.controls.end_date.value!).toLocaleDateString("bg-BG")}`)
        },
        (error: any) => {
          this.email_failed = true
          this.form_submitting = false
          console.log('FAILED...', (error as EmailJSResponseStatus).text);
        },
      );
  }
}
