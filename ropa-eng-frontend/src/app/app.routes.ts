import { Routes } from '@angular/router';

export const routes: Routes = [{
    path:'login',
    loadComponent: ()=>
        import('./features/account/login/login.component').then(
            (m) => m.LoginComponent),
},
{
    path:'register',
    loadComponent: ()=>
        import('./features/account/register/register.component').then(
            (m) => m.RegisterComponent),
},

    {path:'departments',
    loadComponent: ()=>
        import('./features/department/list/list.component').then(
            (m) => m.ListComponent),},
{
    path:'departments/:id',
    loadComponent: ()=>
        import('./features/department/detail/detail.component').then(
            (m) => m.DetailComponent),
            },

];
