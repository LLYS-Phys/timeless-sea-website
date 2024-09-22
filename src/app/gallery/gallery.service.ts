import { Injectable } from "@angular/core";
import { ImageItem } from "ng-gallery";
import { listBlueRoomImages, listGardenImages, listGreenRoomImages, listHouseImages, listOutImages, listRedRoomImages } from "./gallery.data";

@Injectable({providedIn: 'root'})
export class GalleryService {
    getHouseImages () {
        let images: ImageItem[] = []
        listHouseImages().forEach((image) => {
            images.push(new ImageItem({src: '/images/' + image.name, thumb: '/images/' + image.name, alt: image.alt}))
        })
        return images
    }

    getBlueRoomImages () {
        let images: ImageItem[] = []
        listBlueRoomImages().forEach((image) => {
            images.push(new ImageItem({src: '/images/' + image.name, thumb: '/images/' + image.name, alt: image.alt}))
        })
        return images
    }

    getGreenRoomImages () {
        let images: ImageItem[] = []
        listGreenRoomImages().forEach((image) => {
            images.push(new ImageItem({src: '/images/' + image.name, thumb: '/images/' + image.name, alt: image.alt}))
        })
        return images
    }

    getRedRoomImages () {
        let images: ImageItem[] = []
        listRedRoomImages().forEach((image) => {
            images.push(new ImageItem({src: '/images/' + image.name, thumb: '/images/' + image.name, alt: image.alt}))
        })
        return images
    }

    getOutImages () {
        let images: ImageItem[] = []
        listOutImages().forEach((image) => {
            images.push(new ImageItem({src: '/images/' + image.name, thumb: '/images/' + image.name, alt: image.alt}))
        })
        return images
    }

    getGardenImages () {
        let images: ImageItem[] = []
        listGardenImages().forEach((image) => {
            images.push(new ImageItem({src: '/images/' + image.name, thumb: '/images/' + image.name, alt: image.alt}))
        })
        return images
    }
}