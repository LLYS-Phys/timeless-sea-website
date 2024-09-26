import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

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
        children: [
            {
                path: '',
                redirectTo: 'login',
                pathMatch: 'full'
            },
            {
                path: 'login',
                loadComponent: () => import('./auth/login/login.component').then(comp => comp.LoginComponent)
            },
            {
                path: 'admin',
                loadComponent: () => import('./auth/admin/admin.component').then(comp => comp.AdminComponent)
            }
        ]
    },
    {
        path: '**',
        component: NotFoundComponent
    }
];
