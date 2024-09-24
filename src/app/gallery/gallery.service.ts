import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ImageItem } from "ng-gallery";

@Injectable({providedIn: 'root'})
export class GalleryService {    
    filterImages( type: string, allImages: string[] ) {
        let images: ImageItem[] = []
        allImages
            .filter((image) => JSON.parse(image).type === type)
            .sort((a,b) => {
                return JSON.parse(a).order - JSON.parse(b).order
            })
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