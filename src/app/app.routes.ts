import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'home',
                component: HomeComponent
            }
        ]
    },
    {
        path: 'contacts',
        loadComponent: () => import('./contacts/contacts.component').then((comp) => comp.ContactsComponent)
    },
    {
        path: 'about',
        loadComponent: () => import('./about/about.component').then((comp) => comp.AboutComponent)
    },
    {
        path: 'gallery',
        loadComponent: () => import('./gallery/gallery.component').then((comp) => comp.GalleryComponent)
    },
    {
        path: '**',
        loadComponent: () => import('./not-found/not-found.component').then((comp) => comp.NotFoundComponent)
    }
];
