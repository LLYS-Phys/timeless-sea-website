import { Component, OnInit } from '@angular/core';
import { GalleryModule, GalleryItem, ImageItem } from 'ng-gallery';
import { GalleryService } from './gallery.service';

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

  constructor(private galleryService: GalleryService) {}

  ngOnInit() {
    this.interiorImages = this.galleryService.getHouseImages()
    this.blueRoomImages = this.galleryService.getBlueRoomImages()
    this.greenRoomImages = this.galleryService.getGreenRoomImages()
    this.redRoomImages = this.galleryService.getRedRoomImages()
    this.outImages = this.galleryService.getOutImages()
    this.gardenImages = this.galleryService.getGardenImages()
  }
}
