import { Component, DestroyRef, OnInit } from '@angular/core';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
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
  images: {
    interiorImages: GalleryItem[],
    blueRoomImages: GalleryItem[],
    greenRoomImages: GalleryItem[],
    redRoomImages: GalleryItem[],
    outImages: GalleryItem[],
    gardenImages: GalleryItem[] 
  } = { interiorImages: [], blueRoomImages: [], greenRoomImages: [], redRoomImages: [], outImages: [], gardenImages: [] }
  allImages: string[] = []

  constructor(private galleryService: GalleryService, private http: HttpClient, private destroRef: DestroyRef) {}

  ngOnInit() {
    const imagesSubscription = this.http
      .get<Observable<string>>('https://timeless-sea-default-rtdb.europe-west1.firebasedatabase.app/images.json')
      .subscribe({
        next: (data) => {
          data.forEach((el) => {
            this.allImages.push(el
              .replaceAll("'", "\"")
              .replace("name", "\"name\"")
              .replace("alt", "\"alt\"")
              .replace("type", "\"type\"")
            )
          })
        },
        complete: () => {
          this.images = {
            interiorImages: this.galleryService.getImages('house', this.allImages),
            blueRoomImages: this.galleryService.getImages('blue', this.allImages),
            greenRoomImages: this.galleryService.getImages('green', this.allImages),
            redRoomImages: this.galleryService.getImages('red', this.allImages),
            outImages: this.galleryService.getImages('out', this.allImages),
            gardenImages: this.galleryService.getImages('garden', this.allImages)
          }
        },
        error: (err) => {
          console.log(err)
        }
      })

    this.destroRef.onDestroy(() => imagesSubscription.unsubscribe())
  }
}
