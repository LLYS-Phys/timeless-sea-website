import { Injectable } from "@angular/core";
import { ImageItem } from "ng-gallery";
import { listImages } from "./gallery.data";

@Injectable({providedIn: 'root'})
export class GalleryService {
    getImages(type: string) {
        let images: ImageItem[] = []
        listImages(type).forEach((image) => {
            images.push(new ImageItem({src: '/images/' + image.name, thumb: '/images/' + image.name, alt: image.alt}))
        })
        return images
    }
}