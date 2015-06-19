---
layout: post
title: "使用Async获取数据"
date: 2015-06-19 13:15:38
categories: d3
tags: d3 async
keywords: Async.js asynchronous
author: 三世
author-link: http://san.sanrabbit.com
---

D3.js加载外部资源的方法（例[d3.json](https://github.com/mbostock/d3/wiki/Requests#d3_json)）强制使用异步请求，那么在请求多份数据时，如何做到在所有数据都获取完毕以后再执行处理方法呢？

##嵌套
初步想到的办法：使用嵌套，在前一个请求的callback里请求下一个

    d3.json('data1.json', function(result1) {
	    ...
	    d3.json('data2.json', function(result2) {
		    // here 
		    // result1,result2
	    });
	    ...
    });
这种方法简单易懂，但是缺点呢
1. 如果n个数据请求，就需要n-1个嵌套，明显不合理
2. 数据请求是同步执行的，所需时间为t1+t2+...+tn，效率低

##计数
计数的方法，所有请求在回调中调用同一个处理方法，在处理方法内部对调用进行计数，如果数目等于请求数目，则代表所有数据已请求完毕，可以进行接下来的处理。

	d3.json('data1.json', function(result1) {
		handle(result1);
	});
	d3.json('data2.json', function(result2) {
		handle(result2);
	});
	.
	var count = 2;
	var results = [];
	function handle(result) {
		results.push(result);
		if(--count != 0) {
			return;
		}
		// here
		// results
	}
	
计数方法可以避免嵌套方法的两个缺点。

下面我们介绍使用[Async.js](https://github.com/caolan/async)库来实现，Async 是一个工具模块，提供了直接而强大的 JavaScript 异步功能。

虽然是为 Node.js 设计的，但是它也可以直接在浏览器中使用。Async 提供了大约20个函数，包括 map, reduce, filter, forEach 等等，也有常用的异步流程控制模式，并行，瀑布等等。

##async.series
直接看代码

	async.series([
        function (callback) {
            d3.json('data1.json', function (result1) {
                callback(null, result1);
            });
        },
        function (callback) {
            d3.json('data2.json', function (result2) {
                callback(null, result2);
            });
        }
    ], function (err, results) {
	    // here
	    // results
    });
        
这个方法会依次执行数组里指定的方法，所以也会有时间叠加的缺点。
##async.parallel
	async.parallel([
        function (callback) {
            d3.json('data1.json', function (result1) {
                callback(null, result1);
            });
        },
        function (callback) {
            d3.json('data2.json', function (result2) {
                callback(null, result2);
            });
        }
    ], function (err, results) {
	    // here
	    // results
    });
和async.series的使用方法还是一致的，而且避免了时间叠加的缺点，数组内的方法会同时执行。

下面是使用async.parallel方法的例子（右击查看框架源代码）。

 <iframe src="/demo/async/index.html" style="width:740px; height:370px; border: none;"></iframe>

下面分别是async.series和async.parallel请求数据顺序的时间线，可看到后者明显优于前者。

![async.series](/demo/async/async1.jpg)
![async.parallel](/demo/async/async2.jpg)
