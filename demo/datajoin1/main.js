/// <reference path="../../typings/index.d.ts"/>

/*

*/

var data = [
    { "year": 2011, "count": 2 },
    { "year": 2012, "count": 5 },
    { "year": 2013, "count": 7 },
    { "year": 2014, "count": 4 },
    { "year": 2015, "count": 10 },
    { "year": 2016, "count": 9 }
];

/*
* 首先，构造视图
*/
var margin = { top: 20, right: 20, bottom: 20, left: 20 },
    width = 400,
    height = 300;

// svg，位置；g，位置
var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var lines = svg.selectAll('.line')
    .data(data)
    .enter()
    .append('g')
    .attr('class', 'line');

var years = lines.append('text')
    .attr('class', 'year')
    .text(function (d) { return d.year; })
    .attr('y', function (d, i) { return (i + 1) * 40; });

/*
将数字转换为0/1数组，再进行绑定
*/
var rects = lines.append('g')
    .attr('data-index', function (d, i) { return i; })
    .selectAll('rect')
    .data(function (d) {
        return num2binarray(d.count, 17);
    })
    .enter()
    .append('rect')
    .attr('width', 10)
    .attr('height', 20)
    .attr('x', function (d, i) { return i * 15 + 42; })
    .attr('y', function () {
        var i = +d3.select(this.parentNode).attr('data-index');
        return (i) * 40 + 24;
    })
    .attr('fill', function (d) {
        return d == 1 ? '#36fdf2' : '#3a3a3f';
    });

var counts = lines.append('text')
    .attr('class', 'count')
    .text(function (d) { return d.count; })
    .attr('x', 300)
    .attr('y', function (d, i) { return (i + 1) * 40; });



function num2binarray(num, max) {
    return d3.range(1, max + 1).map(function (d) {
        return d <= num ? 1 : 0;
    });
}