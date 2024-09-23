import { Component, DestroyRef, OnInit } from '@angular/core';
import { GalleryModule, GalleryItem } from 'ng-gallery';
import { GalleryService } from './gallery.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [GalleryModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  interiorImages: GalleryItem[] = []
  blueRoomImages: GalleryItem[] = []
  greenRoomImages: GalleryItem[] = []
  redRoomImages: GalleryItem[] = []
  outImages: GalleryItem[] = []
  gardenImages: GalleryItem[] = []

  allImages: string[] = []

  constructor(private galleryService: GalleryService, private http: HttpClient, private destroRef: DestroyRef) {}

  ngOnInit() {
    const imagesSubscription = this.galleryService.fetchImages()
      .subscribe({
        next: (data) => {
          data.forEach((el: string) => {
            this.allImages.push(el)
          })
        },
        complete: () => {
          this.interiorImages = this.galleryService.filterImages('house', this.allImages),
          this.blueRoomImages = this.galleryService.filterImages('blue', this.allImages),
          this.greenRoomImages = this.galleryService.filterImages('green', this.allImages),
          this.redRoomImages = this.galleryService.filterImages('red', this.allImages),
          this.outImages = this.galleryService.filterImages('out', this.allImages),
          this.gardenImages = this.galleryService.filterImages('garden', this.allImages)
        },
        error: (err) => {
          console.log(err)
        }
      })

    this.destroRef.onDestroy(() => imagesSubscription.unsubscribe())
  }
}
