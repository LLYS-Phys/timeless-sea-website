import { Component, DestroyRef, OnInit } from '@angular/core';
import { GalleryModule, GalleryItem } from 'ng-gallery';
import { GalleryService } from './gallery.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [GalleryModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryComponent implements OnInit {
  allImages: {name: string, images: GalleryItem[], type: 'house' | 'blue' | 'red' | 'green' | 'out' | 'garden'}[] = [
    {name: 'interiorImages', images: [], type: 'house'},
    {name: 'blueRoomImages', images: [], type: 'blue'},
    {name: 'greenRoomImages', images: [], type: 'green'},
    {name: 'redRoomImages', images: [], type: 'red'},
    {name: 'outImages', images: [], type: 'out'},
    {name: 'gardenImages', images: [], type: 'garden'}
  ]

  allImagesString: string[] = []

  constructor(private galleryService: GalleryService, private destroRef: DestroyRef) {}

  ngOnInit() {
    const imagesSubscription = this.galleryService.fetchImages()
      .subscribe({
        next: (data) => {
          data.forEach((el: string) => {
            this.allImagesString.push(el)
          })
        },
        complete: () => {
          this.allImages.forEach((imageObj) => {
            imageObj.images = this.galleryService.filterImages(imageObj.type, this.allImagesString)
          })
        },
        error: (err) => {
          console.log(err)
        }
      })

    this.destroRef.onDestroy(() => imagesSubscription.unsubscribe())
  }

  findImageObj (key: string) {
    return this.allImages.find((image) => image.name === key)!.images
  }
}
