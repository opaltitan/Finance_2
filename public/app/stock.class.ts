/**
 * Created by Justin on 7/9/2016.
 */

export class Stock {
    _id: string;
    ticker: string;
    stockName: string;
    state: string;
    hover: string;

    constructor(obj?: any){
        this._id = obj && obj._id || null;
        this.ticker = obj && obj.ticker || null;
        this.stockName = obj && obj.stockName || null;
        this.state = 'inactive';
        this.hover = 'hoverExit';
    }

}

export class StockSearch {
    _id: string;
    ticker: string;
    stockName: string;
    created: Date;
    status: string;
    lastPrice: number;
    change: number;
    changePercent: number;
    timeStamp: Date;
    marketCapitalization: number;
    tradingVolume: number;
    changeYTD: number;
    changeYTDPercent: number;
    priceHigh: number;
    priceLow: number;
    priceOpen: number;
    state: string;

    constructor(obj?: any){
        this._id = obj._id;
        this.ticker = obj.ticker;
        this.stockName = obj.stockName;
        this.created = obj.created;

        this.status = obj.status;
        this.lastPrice = obj.lastPrice;
        this.change = obj.change;
        this.changePercent = obj.changePercent;
        this.timeStamp = obj.timeStamp;
        this.marketCapitalization = obj.marketCapitalization;
        this.tradingVolume = obj.tradingVolume;
        this.changeYTD = obj.changeYTD;
        this.changeYTDPercent = obj.changeYTDPercent;
        this.priceHigh = obj.priceHigh;
        this.priceLow = obj.priceLow;
        this.priceOpen = obj.priceOpen;
        this.state = 'inactive';
    }

    toggleState(): void {
        if(this.state == 'inactive'){
            this.state = 'active';
        } else {
            this.state = 'inactive';
        }
    }

}