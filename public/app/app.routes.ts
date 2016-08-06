/**
 * Created by Justin on 7/9/2016.
 */
import { provideRouter, RouterConfig } from '@angular/router';
import { HomeComponent } from './home.component';
import {    StockListComponent,
            StockListHomeComponent,
            StockSelectionComponent,
            StockCreationComponent } from './stock.component';
import { ReportingComponent } from './reporting.component';

const AppRoutes: RouterConfig = [
    { path: '', component: HomeComponent },
    { path: 'stock', component: StockListComponent, children: [
        { path: '', component: StockListHomeComponent },
        { path: ':id', component: StockSelectionComponent },
        { path: 'item/create', component: StockCreationComponent }
    ]},
    { path: 'reporting', component: ReportingComponent }
];

export const APP_ROUTER_PROVIDERS = [
    provideRouter(AppRoutes)
];