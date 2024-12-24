import { Component, DestroyRef, OnInit, ViewChild } from '@angular/core';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
import { GalleryService } from './gallery.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { GalleryComponent } from 'ng-gallery';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [GalleryModule, MatIconModule, MatButtonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss'
})
export class GalleryPageComponent implements OnInit {
  @ViewChild(GalleryComponent) galleryComponent: GalleryComponent | null = null;
  
  allImagesType: {name: string, images: GalleryItem[], type: 'house' | 'blue' | 'red' | 'green' | 'out' | 'garden'}[] = [
    {name: 'interiorImages', images: [], type: 'house'},
    {name: 'blueRoomImages', images: [], type: 'blue'},
    {name: 'greenRoomImages', images: [], type: 'green'},
    {name: 'redRoomImages', images: [], type: 'red'},
    {name: 'outImages', images: [], type: 'out'},
    {name: 'gardenImages', images: [], type: 'garden'}
  ]

  allImages: string[] = []
  currentGalleryImages: ImageItem[] | null = null
  currentGalleryName: string | null = null

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

  openGallery(target: string[], name: string) {
    document.querySelector(".modal")?.classList.add("active-gallery")
    this.currentGalleryImages = this.getAllImages(target)
    this.currentGalleryName = name
  }
  closeGallery(){
    document.querySelector(".modal")?.classList.remove("active-gallery")
    this.currentGalleryImages = null
    this.currentGalleryName = null
    this.galleryComponent?.reset()
  }

  getAllImages(imageObjKeys: string[]): any[] {
    return imageObjKeys
        .map((key) => this.findImageObj(key)?.images || [])
        .flat();
  }
}
