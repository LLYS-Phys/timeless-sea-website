import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { routes as userRoutes } from './auth/auth.routes';

export const routes: Routes = [
    {
        path: '',
        component: HomeComponent,
        children: [
            {
                path: 'home',
                redirectTo: ''
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
        path: 'auth',
        children: userRoutes
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
