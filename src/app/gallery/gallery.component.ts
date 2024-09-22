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
    this.interiorImages = this.galleryService.getImages('house')
    this.blueRoomImages = this.galleryService.getImages('blue')
    this.greenRoomImages = this.galleryService.getImages('green')
    this.redRoomImages = this.galleryService.getImages('red')
    this.outImages = this.galleryService.getImages('out')
    this.gardenImages = this.galleryService.getImages('garden')
  }
}
