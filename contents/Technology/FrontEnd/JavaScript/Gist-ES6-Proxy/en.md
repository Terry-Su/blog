---
postTime: 2019/1/16 15:00
comment: 3
---

# Introduction
"Proxy" is a frequently used pattern in both virtual world and real world. Those patterns("proxy", "iterator" and "observer",etc) make coding more personably, as if we're building lots of maganificent skyscrapers with robust methods and tools.


# Basic concept
## Single request
![](https://sfault-image.b0.upaiyun.com/114/495/1144958509-596733a98f665_articlex)
## Interaction
![](https://sfault-image.b0.upaiyun.com/368/275/3682758150-596734870a989_articlex)

# Application - Observer
```js
// Create an observer to detect the opening state of light
const basicState = {
	open: false
}
const lightState = new Proxy(basicState, {
	set(obj, prop, value) {
		if (prop === 'open') {
			switch(value) {
				case true: 
					console.log('Light on!')
					break
				case false: 
					console.log('Light off!')
			}
		}

		return true
	}
})


// Turn on light
lightState.open = true    // output: Light on!

// Turn off light
lightState.open = false    // output: Light off!
```

# Grammar
[https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy)



# Conclusion
Try Proxy? Trust it at first
