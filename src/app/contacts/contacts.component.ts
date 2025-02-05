import { HttpClient } from '@angular/common/http';
import { Component, DestroyRef, ViewChild } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';
import { EmailJsType } from './contacts.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { DateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { CommonModule } from '@angular/common';
import ICAL from 'ical.js';
import { PricesType } from '../prices.model'
import { CustomDateAdapter } from './native_date_adapter';
import { PeriodsType } from '../periods.model';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule, MatDatepickerModule, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
  providers: [{provide: MAT_DATE_LOCALE, useValue: 'bg-BG'}, provideNativeDateAdapter(), {provide: DateAdapter, useClass: CustomDateAdapter}]
})
export class ContactsComponent {
  @ViewChild('pickerEndDate') pickerEndDate!: MatDatepicker<any>
  constructor(private http: HttpClient, private destroyRef: DestroyRef, private sanitizer: DomSanitizer){}

  credentials: EmailJsType = {public_key: '', template_id: '', service_id: '', confirmation_template_id: ''}

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
  periods: PeriodsType | null = null

  emailForm = new FormGroup({
    name: new FormControl({value: '', disabled: this.email_sent}, [Validators.required]),
    email: new FormControl({value: '', disabled: this.email_sent}, [Validators.required, Validators.email]),
    phone: new FormControl({value: '', disabled: this.email_sent}, [Validators.required, Validators.pattern(/^\+?\d{5,}$/)]),
    start_date: new FormControl({value: '', disabled: this.email_sent}, [Validators.required]),
    end_date: new FormControl({value: '', disabled: true}, [Validators.required]),
    message: new FormControl({value: '', disabled: this.email_sent}, [Validators.required]),
    calculated_price: new FormControl({value: '', disabled: false})
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

  private fetchPeriods () {
    return this.http.get<PeriodsType>('https://timeless-sea-default-rtdb.europe-west1.firebasedatabase.app/periods.json')
  }

  private fetchBooking() {
    return this.http.get('https://timeless-sea-website-proxy-server.onrender.com/api/booking-calendar', {
      responseType: 'text'  // This is crucial
    });
  }

  private fetchAirBnb() {
    return this.http.get('https://timeless-sea-website-proxy-server.onrender.com/api/airbnb-calendar', {
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
            const eventsBooking = ICAL.parse(icalDataBooking);
            const comp = new ICAL.Component(eventsBooking);
            const vevents = comp.getAllSubcomponents("vevent");

            vevents.forEach((event) => {
              const vevent = new ICAL.Event(event);
              for (let i = vevent.startDate.toJSDate(); i <= vevent.endDate.toJSDate(); i.setDate(i.getDate() + 1)) {
                this.bookedDates.push(new Date(i));
              }
            });
          } catch (error) {
            console.error('Error parsing iCal data:', error);
          }
        },
        complete: () => {
          this.fetchAirBnb().subscribe({
            next: (icalDataAirBnb: string) => {
              try {
                const eventsAirBnb = ICAL.parse(icalDataAirBnb);
                const comp = new ICAL.Component(eventsAirBnb);
                const vevents = comp.getAllSubcomponents("vevent");

                vevents.forEach((event) => {
                  const vevent = new ICAL.Event(event);
                  for (
                    let i = vevent.startDate.toJSDate();
                    i <= vevent.endDate.toJSDate();
                    i.setDate(i.getDate() + 1)
                  ) {
                    this.bookedDates.push(new Date(i));
                  }
                });
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
          this.credentials!.confirmation_template_id = data.confirmation_template_id
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

      const periodsSubscription = this.fetchPeriods().subscribe({
        next: (data) => {
          this.periods = data
        }
      })

      this.destroyRef.onDestroy(() => {
        credentialsSubscription.unsubscribe()
        bookedDatesSubscription.unsubscribe()
        pricesSubscription.unsubscribe()
        periodsSubscription.unsubscribe()
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
    this.pickerEndDate.startAt = this.emailForm.controls.end_date.valid 
      ? this.emailForm.controls.end_date.value 
      : this.emailForm.controls.start_date.value;
    
    const startDate = new Date(this.emailForm.controls.start_date.value!);
    const endDate = new Date(this.emailForm.controls.end_date.value!);

    let discount = false
    let tempCalculatedPrice = 0

    const summer_strong_curent_year = [new Date(`${new Date().getFullYear()}-${this.periods?.summer_strong_start.date} 00:00`), new Date(`${new Date().getFullYear()}-${this.periods?.summer_strong_end.date} 00:00`)]
    const summer_strong_next_year = [new Date(`${new Date().getFullYear() + 1}-${this.periods?.summer_strong_start.date} 00:00`), new Date(`${new Date().getFullYear() + 1}-${this.periods?.summer_strong_end.date} 00:00`)]
    const summer_weak_current_year1 = [new Date(`${new Date().getFullYear()}-${this.periods?.summer_weak1_start.date} 00:00`), new Date(`${new Date().getFullYear()}-${this.periods?.summer_weak1_end.date} 00:00`)]
    const summer_weak_current_year2 = [new Date(`${new Date().getFullYear()}-${this.periods?.summer_weak2_start.date} 00:00`), new Date(`${new Date().getFullYear()}-${this.periods?.summer_weak2_end.date} 00:00`)]
    const summer_weak_next_year1 = [new Date(`${new Date().getFullYear() + 1}-${this.periods?.summer_weak1_start.date} 00:00`), new Date(`${new Date().getFullYear() + 1}-${this.periods?.summer_weak1_end.date} 00:00`)]
    const summer_weak_next_year2 = [new Date(`${new Date().getFullYear() + 1}-${this.periods?.summer_weak2_start.date} 00:00`), new Date(`${new Date().getFullYear() + 1}-${this.periods?.summer_weak2_end.date} 00:00`)]

    if (startDate && endDate) {
      const timeDifference = endDate.getTime() - startDate.getTime();
      const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
  
      discount = dayDifference >= 7 ? true : false
  
      // Create an array of dates from start_date to (end_date - 1 day)
      const dateArray: Date[] = [];
      let currentDate = new Date(startDate);
  
      while (currentDate < endDate) {
        dateArray.push(new Date(currentDate)); // Store a new Date object
        currentDate.setDate(currentDate.getDate() + 1);
      }
  
      let itemsProcessed = 0
      dateArray.forEach((date) => {
        itemsProcessed++
        if (
          (date.getFullYear() == new Date().getFullYear() && (date < summer_weak_current_year1[0] || date > summer_weak_current_year2[1])) ||
          (date.getFullYear() == new Date().getFullYear() + 1 && (date < summer_weak_next_year1[0] || date > summer_weak_next_year2[1]))
        ) {
          if (date.getDay() == 5 || date.getDay() == 6) {
            console.log(`${tempCalculatedPrice}+${Number(this.prices?.winter_weekend)}=${tempCalculatedPrice+Number(this.prices?.winter_weekend)}`)
            tempCalculatedPrice += Number(this.prices?.winter_weekend)
          }
          else {
            console.log(`${tempCalculatedPrice}+${Number(this.prices?.winter_weekday)}=${tempCalculatedPrice+Number(this.prices?.winter_weekday)}`)
            tempCalculatedPrice += Number(this.prices?.winter_weekday)
          }
        }
        else {
          if (
            (date.getFullYear() == new Date().getFullYear() && date >= summer_strong_curent_year[0] && date <= summer_strong_curent_year[1]) ||
            (date.getFullYear() == new Date().getFullYear() + 1 && date <= summer_strong_next_year[0] && date <= summer_strong_next_year[1])){
              if (date.getDay() == 5 || date.getDay() == 6) {
                console.log(`${tempCalculatedPrice}+${Number(this.prices?.strong_summer_weekend)}=${tempCalculatedPrice+Number(this.prices?.strong_summer_weekend)}`)
                tempCalculatedPrice += Number(this.prices?.strong_summer_weekend)
              }
              else {
                console.log(`${tempCalculatedPrice}+${Number(this.prices?.strong_summer_weekday)}=${tempCalculatedPrice+Number(this.prices?.strong_summer_weekday)}`)
                tempCalculatedPrice += Number(this.prices?.strong_summer_weekday)
              }
          }
          else {
            if (date.getDay() == 5 || date.getDay() == 6) {
              console.log(`${tempCalculatedPrice}+${Number(this.prices?.weak_summer_weekend)}=${tempCalculatedPrice+Number(this.prices?.weak_summer_weekend)}`)
              tempCalculatedPrice += Number(this.prices?.weak_summer_weekend)
            }
            else {
              console.log(`${tempCalculatedPrice}+${Number(this.prices?.weak_summer_weekday)}=${tempCalculatedPrice+Number(this.prices?.weak_summer_weekday)}`)
              tempCalculatedPrice += Number(this.prices?.weak_summer_weekday)
            }
          }
        }

        if (itemsProcessed == dateArray.length) {
          // To calcualte tempCalculatedPrice here
          // take into account discount as well
          this.calculatedPrice = tempCalculatedPrice.toString()
          if (discount) {
            console.log(`${Number(this.calculatedPrice)}-${(Number(this.calculatedPrice)*0.1)}=${Number(this.calculatedPrice) - (Number(this.calculatedPrice)*0.1)}`)
            this.calculatedPrice = (Number(this.calculatedPrice) - (Number(this.calculatedPrice)*0.1)).toString()
          }

          this.emailForm.controls.calculated_price.setValue(this.calculatedPrice)
        }
      })
    }
  }  

  public checkIfEndDateReady() {
    this.emailForm.controls.end_date.patchValue('')
    this.emailForm.controls.end_date.disable()
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
    console.log(e.target)
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

    emailjs
      .sendForm(this.credentials!.service_id, this.credentials!.confirmation_template_id, e.target as HTMLFormElement, {
        publicKey: this.credentials!.public_key,
      })
      .then(
        () => {console.log('test')},
        (error: any) => {
          console.log(e.target)
          console.log('FAILED...', (error as EmailJSResponseStatus).text);
        },
      );
  }
}
