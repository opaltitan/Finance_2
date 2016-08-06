/**
 * Created by Justin on 7/9/2016.
 */
import { Component, OnInit, ElementRef, EventEmitter, Injectable, Inject, trigger, state, style, transition, animate } from '@angular/core';
import { CORE_DIRECTIVES } from '@angular/common';
import { Stock, StockSearch } from './stock.class';
import { Http, Response } from '@angular/http';
import { ROUTER_DIRECTIVES, Router, ActivatedRoute } from '@angular/router';
import { StockService, StockIO } from './stock.service';
import { Observable } from 'rxjs';
import * as io from 'socket.io-client';
import * as d3 from 'd3';

@Component({
    selector:'chart-home',
    providers: [ StockService],
    template:`<div class="chart"></div>`
})

export class ChartHome {
    divs: any;
    data: StockSearch[];
    margin = {
        top: 0,
        right: 20,
        bottom: 30,
        left: 20
    };
    x;
    y;
    xAxis;
    yAxis;

    constructor(private el: ElementRef, public stockService: StockService){

        this.stockService.pullAllStockData()
            .subscribe((returnedList: Stock[]) => {
                graph = d3.select(this.el.nativeElement)
                    .append('svg');

                graph.append('g').attr('class', 'data');
                graph.append('g').attr('class', 'x-axis axis');
                graph.append('g').attr('class', 'y-axis axis');

                this.data = returnedList;

                this.x = d3.scale.ordinal()
                    .rangeRoundBands([0,800],.1);

                this.y = d3.scale.linear()
                    .rangeRound([400,0]);

                this.xAxis = d3.svg.axis()
                    .scale(this.x)
                    .orient('bottom');

                this.yAxis = d3.svg.axis()
                    .scale(this.y)
                    .orient('left')
                    .tickFormat(d3.format('.2s'));

                this.x.domain(this.data.map(function(d){ return d.ticker; }));
                this.y.domain([0, d3.max(returnedList, function(d){ return d.priceOpen + 20; })]);

                graph.select('.x-axis')
                    .attr('transform', 'translate(' + this.margin.left + ',400)')
                    .call(this.xAxis);

                graph.select('.y-axis')
                    .attr('transform', 'translate(' + this.margin.left + ',0)')
                    .call(this.yAxis);

                thisX = this.x;
                thisY = this.y;
                thisMargin = this.margin;

                chartData = [];
                returnedList.forEach((d) => {
                    chartData.push({
                        ticker: d.ticker,
                        priceOpen: d.priceOpen,
                        priceOpen_Y: thisY(d.priceOpen)
                    })
                });


                graph
                    .selectAll('.data')
                    .data(chartData)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('x', function(d){ return thisX(d.ticker) + thisMargin.left + (thisMargin.right / 2); })
                    .attr('width', thisX.rangeBand() / 2)
                    .attr('y', function(d) { return d.priceOpen_Y; })
                    .attr('height', function(d) { return 400 - d.priceOpen_Y})
                ;


                graph = d3.select(this.el.nativeElement)
                    .append('svg');

                graph.append('g').attr('class', 'data');
                graph.append('g').attr('class', 'x-axis axis');
                graph.append('g').attr('class', 'y-axis axis');

                this.data = returnedList;

                this.x = d3.scale.ordinal()
                    .rangeRoundBands([0,800],.1);

                this.y = d3.scale.linear()
                    .rangeRound([400,0]);

                this.xAxis = d3.svg.axis()
                    .scale(this.x)
                    .orient('bottom');

                this.yAxis = d3.svg.axis()
                    .scale(this.y)
                    .orient('left')
                    .tickFormat(d3.format('.2s'));

                this.x.domain(this.data.map(function(d){ return d.ticker; }));
                this.y.domain([0, d3.max(returnedList, function(d){ return d.priceOpen + 20; })]);

                graph.select('.x-axis')
                    .attr('transform', 'translate(' + this.margin.left + ',400)')
                    .call(this.xAxis);

                graph.select('.y-axis')
                    .attr('transform', 'translate(' + this.margin.left + ',0)')
                    .call(this.yAxis);

                thisX = this.x;
                thisY = this.y;
                thisMargin = this.margin;

                chartData = [];
                returnedList.forEach((d) => {
                    chartData.push({
                        ticker: d.ticker,
                        priceOpen: d.priceOpen,
                        priceOpen_Y: thisY(d.priceOpen)
                    })
                });

                graph
                    .selectAll('.data')
                    .data(chartData)
                    .enter()
                    .append('rect')
                    .attr('class', 'bar')
                    .attr('x', function(d){ return thisX(d.ticker) + thisMargin.left + (thisMargin.right / 2); })
                    .attr('width', thisX.rangeBand() / 2)
                    .attr('y', function(d) { return d.priceOpen_Y; })
                    .attr('height', function(d) { return 400 - d.priceOpen_Y})
                ;


                console.log(this.data);

            });

    }
}

@Component({
    selector: 'reporting-home',
    directives: [ChartHome],
    template: `<chart-home></chart-home>`
})

export class ReportingComponent{


}