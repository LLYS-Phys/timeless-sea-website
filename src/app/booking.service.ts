import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import ICAL from 'ical.js';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookedDatesSubject = new BehaviorSubject<Date[]>([]);
  bookedDates$ = this.bookedDatesSubject.asObservable();

  constructor(private http: HttpClient) {}

  fetchBooking() {
    return this.http.get('https://timeless-sea-website-proxy-server.onrender.com/api/booking-calendar', {
      responseType: 'text'
    });
  }

  fetchAirBnb() {
    return this.http.get('https://timeless-sea-website-proxy-server.onrender.com/api/airbnb-calendar', {
      responseType: 'text'
    });
  }

  loadBookedDates() {
    let bookedDates: Date[] = [];

    this.fetchBooking().subscribe({
      next: (icalDataBooking: string) => {
        try {
          const eventsBooking = ICAL.parse(icalDataBooking);
          const comp = new ICAL.Component(eventsBooking);
          const vevents = comp.getAllSubcomponents('vevent');

          vevents.forEach(event => {
            const vevent = new ICAL.Event(event);
            for (
              let i = vevent.startDate.toJSDate();
              i <= vevent.endDate.toJSDate();
              i.setDate(i.getDate() + 1)
            ) {
              bookedDates.push(new Date(i));
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
              const vevents = comp.getAllSubcomponents('vevent');

              vevents.forEach(event => {
                const vevent = new ICAL.Event(event);
                for (
                  let i = vevent.startDate.toJSDate();
                  i <= vevent.endDate.toJSDate();
                  i.setDate(i.getDate() + 1)
                ) {
                  bookedDates.push(new Date(i));
                }
              });
            } catch (error) {
              console.error('Error parsing iCal data:', error);
            }
          },
          complete: () => {
            this.bookedDatesSubject.next(bookedDates);
          },
          error: err => console.error('Error fetching AirBnb iCal data:', err)
        });
      },
      error: err => console.error('Error fetching booking iCal data:', err)
    });
  }
}
