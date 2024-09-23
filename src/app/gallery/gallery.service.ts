import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ImageItem } from "ng-gallery";
import { Observable } from "rxjs";

@Injectable({providedIn: 'root'})
export class GalleryService {
    constructor ( private http: HttpClient ) {}

    fetchImages () {
        return this.http.get<Observable<string>>('https://timeless-sea-default-rtdb.europe-west1.firebasedatabase.app/images.json')
    }
    
    filterImages( type: 'house' | 'blue' | 'red' | 'green' | 'out' | 'garden', allImages: string[] ) {
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