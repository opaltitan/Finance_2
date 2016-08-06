/**
 * Created by Justin on 7/9/2016.
 */
import { Observable } from 'rxjs';
import { Component, OnInit, ElementRef, EventEmitter, Injectable } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { Stock, StockSearch } from './stock.class';
import * as io from 'socket.io-client';

@Injectable()
export class StockIO {
    private url = 'http://localhost:3001';
    private socket;

    constructor(public http: Http){
        this.socket = io.connect(this.url);
        return this.socket;
    }

}

@Injectable()
export class StockService {
    private url = 'http://localhost:3001';
    private socket;

    constructor(public http: Http){
        this.socket = io.connect(this.url);
    }

    pullStocks(): Observable<Stock[]> {
        return this.http.get('http://localhost:3001/api/stock')
            .map((res: Response) => {
                return (<any>res.json()).map(item => {
                    return new Stock({
                        _id: item._id,
                        ticker: item.ticker,
                        stockName: item.stockName
                    })
                })
            })
    }

    pullStock(public id: String): Observable<Stock> {
        return this.http.get('http://localhost:3001/api/stock/' + id)
            .map((res: Response) => {
                return new StockSearch({
                    _id: res.json()._id,
                    ticker: res.json().ticker,
                    stockName: res.json().stockName,
                    created: res.json().created,

                    status: res.json().currentPrice.status,
                    lastPrice: res.json().currentPrice.LastPrice,
                    change: res.json().currentPrice.Change,
                    changePercent: res.json().currentPrice.ChangePercent,
                    timeStamp: res.json().currentPrice.TimeStamp,
                    marketCapitalization: res.json().currentPrice.MarketCap,
                    tradingVolume: res.json().currentPrice.Volume,
                    changeYTD: res.json().currentPrice.ChangeYTD,
                    changeYTDPercent: res.json().currentPrice.ChangePercentYTD,
                    priceHigh: res.json().currentPrice.High,
                    priceLow: res.json().currentPrice.Low,
                    priceOpen: res.json().currentPrice.Open
                });
            });
    }

    pullAllStockData(): Observable<StockSearch[]> {

        return this.http.get('http://localhost:3001/api/reporting')
            .map((res: Response) => {
                return (<any>res.json()).map(item => {
                    return new StockSearch({
                        _id: item._id,
                        ticker: item.ticker,
                        stockName: item.stockName,
                        created: item.created,

                        status: item.currentPrice.status,
                        lastPrice: item.currentPrice.LastPrice,
                        change: item.currentPrice.Change,
                        changePercent: item.currentPrice.ChangePercent,
                        timeStamp: item.currentPrice.TimeStamp,
                        marketCapitalization: item.currentPrice.MarketCap,
                        tradingVolume: item.currentPrice.Volume,
                        changeYTD: item.currentPrice.ChangeYTD,
                        changeYTDPercent: item.currentPrice.ChangePercentYTD,
                        priceHigh: item.currentPrice.High,
                        priceLow: item.currentPrice.Low,
                        priceOpen: item.currentPrice.Open
                    });
                });
            });

    }

    addStock(public stock: Stock): Observable<Stock> {
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');

        return this.http.post('http://localhost:3001/api/stock',
            JSON.stringify({
                ticker: stock.ticker,
                stockName: stock.stockName
            }),
            { headers: headers })
            .map((res: Response) => {
                return new Stock({
                    _id: res.json()._id,
                    ticker: res.json().ticker,
                    stockName: res.json().stockName,
                    created: res.json().created
                })
            });
    }

    search(qLookup: string): Observable<Stock[]> {
        console.log('search');
        return this.http.get('http://localhost:3001/api/stock/lookup/' + qLookup)
            .map((response: Response) => {
                    console.log(response.json());
                    return (<any>response.json()).map(item => {
                        // console.log("raw item", item); // uncomment if you want to debug
                        console.log(item.Symbol);
                        return new StockSearch({
                            ticker: item.Symbol,
                            stockName: item.Name,
                            marketExchange: item.Exchange
                        });
                    })
                }
            )
    }

}