---
postTime: 2018/10/12 16:22
comment: 12
---

Suppose there's a div with a child div in it, and both of 2 divs have registered click events. If we click on the child div, which click event of 2 divs will fire first?  
![](https://terry-su.github.io/BlogCDN/images/blog-event-capture-bubbling/1.png)

That question will take us to the topic today: Event Bubbling and Capture, in which the **three phases of event propagation** is the **key**.

To solve the question above, we've gotta know what event bubbling and capture are. And to know event bubbling and capture, we've to know how the dom events of dom elements fire. 

As found in [W3C-Event Flow](https://www.w3.org/TR/DOM-Level-3-Events/#event-flow), if a dom event was triggered, its event objects will pass through 3 phases to dispatch themselves to event targets(dom elements):  

![](https://terry-su.github.io/BlogCDN/images/blog-event-capture-bubbling/2.png)    

1. Capture phase  
The event object passes through to the event target's ancestors from `Window` to the event target's parent.  
If there're other available event targets whose capture attribute is set to `true`, then the event object will be dispatched to them.

2. Target phase  
The event object arrives the event target.   
If the event target's event type indicates the event doesn't bubble, then the event object will stop after this phase.

3. Bubbling Phase  
(Reverse to capture phase)The event object passes through to the event target's ancestors from the event target's parent to `Window`.  
If there're other available event targets whose bubbling attribute is set to `true`, then the event object will be dispatched to them.


Let's look back at the previous question, the answer can be clear.   

<iframe src="https://terry-su.github.io/BlogCDN/iframes/js/event-capture-bubbling/example/index.html?mode=result" frameborder="0"></iframe>


In this example, each box and its inner box both have registered click events. Once they were clicked, their borders will highlight one by one by the event propagation order. With the three phases of event propagation above, we could know how the 4 situations above happened.



To make a summary: browser captures the event targets whose capture attribute is `true` by dom tree order first, then bubbles the event targets whose bubbling attribute is `true` by reverse dom tree order.
