---
postTime: 2017/08/08 22:40
comment: 4
---

# Introduction
Do you prefer the usage of "ES6 Promise"? If you do, you will like the usage of "Fetch" too.  
Compared to "Ajax", "Fetch" owns a competitive feature: promise, which synchronize asynchronous methods elegantly, the meaning and the usage of "Fetch"  can be understood easily as well.   
Here, I'd like to list the most common usage of "Fetch". 

# Flow
The flow of fetching stuff is simple:    
![](https://sfault-image.b0.upaiyun.com/381/502/3815021434-595f6cfd6f71b_articlex)   

# Usage
## Fetch once
Suppose we would fetch the content of an remote html
```js
fetch('./data/test.html')
	.then(function (response) {
		return response.text()    // return a promise 
	})
	.then(function (body) {
		console.log( body )    // log: html content
	})
```

## Fetch data right after the other data fetched(Chain)
If we'd like to fetch data(json) right after fetching content(html)
```js
fetch('./data/test.html')
	.then(response => {
		return response.text()
	})
	.then(body => {
		console.log(body)
		return fetch('./data/test.json')  // return a promise(`fetch('/url')` will return a promise ) 
	})
	.then(response => {
		return response.json()  // return a promise too
	})
	.then(json => {
		console.log(json)  // log: json's data
	})
```



## Complete all fetching action
```js
Promise.all([
	Promise.resolve(fetch('./data/test.html')),
	Promise.resolve(fetch('./data/test.json'))
]).then(data => {
	console.log('Two requests are both completed!')
})
```


# API
[Github Fetch Document](https://github.github.io/fetch/)  
[Offcial Manual](https://fetch.spec.whatwg.org/)

# Conclusion
Fetch, well done!
