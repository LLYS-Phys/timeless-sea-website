import { Injectable } from "@angular/core";
import { ImageItem } from "ng-gallery";

@Injectable({providedIn: 'root'})
export class GalleryService {
    getImages( type: 'house' | 'blue' | 'red' | 'green' | 'out' | 'garden', allImages: string[] ) {
        let images: ImageItem[] = []
        allImages
            .filter((image) => JSON.parse(image).type === type)
            .forEach((image) => {
                images.push(new ImageItem(
                    {
                        src: '/images/' + JSON.parse(image).name, 
                        thumb: '/images/' + JSON.parse(image).name, 
                        alt: JSON.parse(image).alt
                    }
                )
            )
        })
        return images
    }
}