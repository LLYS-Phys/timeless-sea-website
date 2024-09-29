import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        loadComponent: () => import('./login/login.component').then(comp => comp.LoginComponent)
    },
    {
        path: 'admin',
        loadComponent: () => import('./admin/admin.component').then(comp => comp.AdminComponent)
    }
]