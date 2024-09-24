import { Component, DestroyRef, OnInit } from '@angular/core';
import { GalleryModule, GalleryItem } from 'ng-gallery';
import { GalleryService } from './gallery.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [GalleryModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  allImagesType: {name: string, images: GalleryItem[], type: 'house' | 'blue' | 'red' | 'green' | 'out' | 'garden'}[] = [
    {name: 'interiorImages', images: [], type: 'house'},
    {name: 'blueRoomImages', images: [], type: 'blue'},
    {name: 'greenRoomImages', images: [], type: 'green'},
    {name: 'redRoomImages', images: [], type: 'red'},
    {name: 'outImages', images: [], type: 'out'},
    {name: 'gardenImages', images: [], type: 'garden'}
  ]

  allImages: string[] = []

  constructor(private galleryService: GalleryService, private destroRef: DestroyRef, private http: HttpClient) {}

  private fetchImages () {
    return this.http.get<Observable<string>>('https://timeless-sea-default-rtdb.europe-west1.firebasedatabase.app/images.json')
  }

  ngOnInit() {
    const imagesSubscription = this.fetchImages()
      .subscribe({
        next: (data) => {
          data.forEach((el: string) => {
            this.allImages.push(el)
          })
        },
        complete: () => {
          this.allImagesType.forEach((imageObj) => {
            imageObj.images = this.galleryService.filterImages(imageObj.type, this.allImages)
          })
        },
        error: (err) => {
          console.log(err)
        }
      })

    this.destroRef.onDestroy(() => imagesSubscription.unsubscribe())
  }

  findImageObj (key: string) {
    return this.allImagesType.find((image) => image.name === key)
  }
}
