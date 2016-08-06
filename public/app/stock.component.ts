/**
 * Created by Justin on 7/9/2016.
 */
import { Component, OnInit, ElementRef, EventEmitter, Injectable, trigger, state, style, transition, animate } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { Stock, StockSearch } from './stock.class';
import { Http, Response } from '@angular/http';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { StockService, StockIO } from './stock.service';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';

/** Stock List - This renders */
@Component({
    providers: [StockService, StockIO],
    selector: 'stock-list',
    directives: [ ROUTER_DIRECTIVES ],
    animations: [
        trigger('itemState', [
            state('inactive', style({
                backgroundColor: '#3A3A3A',
                font: '14px "Lucida Grande", Helvetica, Arial, sans-serif',
                transform: 'scale(1)'
            })),
            state('active', style({
                backgroundColor: '#4F4D3F',
                font: '18px "Lucida Grande", Helvetica, Arial, sans-serif',
            })),
            transition('inactive => active', animate('100ms ease-in')),
            transition('active => inactive', animate('100ms ease-out'))
        ]),
        trigger('itemHover', [
            state('hoverEnter', style({
                backgroundColor: '#4F4D3F'
            })),
            state('hoverExit', style({
                backgroundColor: '#3A3A3A'
            })),
            transition('hoverExit => hoverEnter', animate('50ms ease-in')),
            transition('hoverEnter => hoverExit', animate('50ms ease-out'))
        ])
    ],
    template: `
            <div class="list-left">
            <h1>Stock</h1>
            <a [routerLink]="['item/create']">Create</a>
            <br>
            <ul>
                <li *ngFor="let stock of stocks"
                    @itemState = "stock.state"
                    @itemHover = "stock.hover"
                    (click)="toggleState(stock)"
                    (mouseover)="toggleHover(stock)">
                    <a [routerLink]="['stock', {id: stock._id }]">
                        <div class="list_item"><small>{{ stock.ticker }}</small></div>
                        <div class="list_item"><small>{{ stock.stockName }}</small></div>
                    </a>
                </li>
            </ul>
        </div>
        <router-outlet></router-outlet>
    `
})

export class StockListComponent implements OnInit {
    stocks: Stock[];

    constructor(public router: Router, public http: Http, public stockService: StockService, public stockIO: StockIO){
        this.stockService.pullStocks()
            .subscribe((returnedList: Stock[]) => {
                this.stocks = returnedList;
                this.stockIO.on('stock_add', (data: Stock) => {
                    this.stocks.push(data);
                });
            });
    }

    ngOnInit(): void {

    }

    toggleState(stock: Stock): void {
        stock.state = 'active';
        this.stocks.map((item) => {
            if(item !== stock){
                item.state = 'inactive';
            }
        });
    }

    toggleHover(stock: Stock): void {
        this.stocks.map((item) => {
            item.hover = 'hoverExit';
            if(item.state=='active'){
                item.hover = 'hoverEnter';
            }
        });
        stock.hover = 'hoverEnter';
    }

}

@Component({
    selector: 'stock-list-home',
    template: `
        <h2>Select a stock to view details, or add a new stock to the list.</h2>
    `
})

export class StockListHomeComponent{}

@Component({
    selector: 'stock-detail',
    inputs: ['stockSelected'],
    directives: [ ROUTER_DIRECTIVES ],
    animations: [
        trigger('detailState', [
            state('inactive', style({
                opacity: '0'
            })),
            state('active', style({
                opacity: '1'
            })),
            transition('inactive => active', animate('50ms ease-in')),
            transition('active => inactive', animate('50ms ease-out'))
        ])
    ],
    template: `
        <div class="detail">
            <h1>Daily Stock Activity</h1>
            <div *ngIf="stockSelected"
                @detailState = "stockSelected.state"
                (show)="stockSelected.toggleState()">
                <div class="detail_line"><div class="label">Ticker:</div>{{ stockSelected.ticker }}</div>
                <div class="detail_line"><div class="label">Stock Name:</div>{{ stockSelected.stockName }}</div>
                <br>
                <div class="detail_line"><div class="label">Last Price:</div>{{ stockSelected.lastPrice | number:'1.0-3' }}</div>
                <div class="detail_line"><div class="label">Last Change (USD):</div>{{ stockSelected.change | number:'1.0-3' }}</div>
                <div class="detail_line"><div class="label">Last Change (%):</div>{{ stockSelected.changePercent | number:'1.0-3' }}</div>
                <br>
                <div class="detail_line"><div class="label">Market Capitalization (USD):</div>{{ stockSelected.marketCapitalization | number:'1.0-3' }}</div>
                <div class="detail_line"><div class="label">Trading Volume:</div>{{ stockSelected.tradingVolume | number:'1.0-3' }}</div>
                <div class="detail_line"><div class="label">YTD Price Change (USD):</div>{{ stockSelected.changeYTD | number:'1.0-3' }}</div>
                <div class="detail_line"><div class="label">YTD Price Change (%):</div>{{ stockSelected.changeYTDPercent | number:'1.0-3' }}</div>
                <div class="detail_line"><div class="label">Current Day High (USD):</div>{{ stockSelected.priceHigh | number:'1.0-3' }}</div>
                <div class="detail_line"><div class="label">Current Day Low (USD):</div>{{ stockSelected.priceLow | number:'1.0-3' }}</div>
                <div class="detail_line"><div class="label">Current Day Open (USD):</div>{{ stockSelected.priceOpen | number:'1.0-3' }}</div>
            </div>
        </div>
    `
})

export class StockSelectionComponent {
    stockSelected: StockSearch;

    id: string;

    constructor(public activatedRoute: ActivatedRoute, public http: Http, public stockService: StockService){
        this.activatedRoute.params
            .map(params => params['id'])
            .subscribe((id) => {
                this.id = id;
                this.stockService.pullStock(this.id)
                    .subscribe((returnedStock: StockSearch) => {
                        this.stockSelected = returnedStock;
                        this.stockSelected.toggleState();
                    });
            });
    }

    ngOnInit() {

    }

}

@Component({
    outputs: ['results'],
    providers: [StockService],
    selector: 'search-box',
    template: `
        <input type="text" class="form-control" placeholder="Search" autofocus>
    `
})

class SearchBox implements OnInit {
    results: EventEmitter<Stock[]> = new EventEmitter<Stock[]>();

    constructor(public stockService: StockService, private el: ElementRef){

    }

    ngOnInit(): void {
        Observable.fromEvent(this.el.nativeElement, 'keyup')
            .map((e: any) => e.target.value)
            .filter((text: string) => text.length > 1)
            .debounceTime(200)
            .map((query: string) => this.stockService.search(query))
            .switch()
            .subscribe(
                (results: Stock[]) => {
                    this.results.emit(results);
                },
                (err: any) => {
                    console.log(err);
                },
                () => {
                    // on completion
                }
            );
    }

}

@Component({
    inputs: ['result'],
    providers: [StockIO],
    selector: 'search-result',
    template: `
        <div class="detail_line"><div class="create_label">{{ result.ticker }}</div><div class="create_item_long">{{ result.stockName }}</div><div class="create_item_short">{{ result.marketExchange }}</div><button type="button" (click)="addStock()">Add</button></div>
    `
})

class SearchResultComponent {
    result: StockSearch;

    constructor(public http: Http, public stockService: StockService, public stockIO: StockIO){

    }

    addStock(): void {
        this.stockService.addStock(this.result)
            .subscribe((returnedStock: Stock) => {
                console.log(returnedStock);
                this.stockIO.emit('stock_add', returnedStock);
            });
    }

}

@Component({
    selector: 'stock-create',
    directives: [ ROUTER_DIRECTIVES, SearchBox, SearchResultComponent],
    template: `
        <div class="detail">
            <h1>Add Stock to List (Search)</h1>
            <div>
                <search-box
                    (results)="updateResults($event)"
                ></search-box>
            </div>
            <br>
            <search-result
                *ngFor="let result of results"
                [result]="result">
            </search-result>
        </div>
    `
})

export class StockCreationComponent {
    results: Stock[];

    constructor(public router: Router, public activatedRoute: ActivatedRoute, public http: Http){

    }
    updateResults(results: Stock[]): void {
        this.results = results;
    }
}