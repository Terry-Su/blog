Data structures are abstract, sometimes hard to be understood. However, vivid metaphor helps us to master them better.

Data strcutres included in this article:

- stack
- queue
- linked list

## Stack

First, let's see stack's core features:

- `push( item )`: push an item at end
- `pop()`: remove an item from end
- `peek()`: get the end element

I found a [very visual example](https://jshilpa.com/stacks-in-a-nutshell-learning-through-examples/) before, that's an open chips box.

And to corresponse with our development habbit(count index from left to right), I push it down.

![](https://terry-su.github.io/BlogCDN/images/pringles.jpg)

- we push a chip into box: `push( chip )`
- we take a chip from box: `pop()`
- current top chip in box: `peek()`

## Queue

Queue is similiar to stack, but easiler to learn.

Queue's key features are:

- `enqueue( item )`: push an item at end
- `dequeue()`: remove an item from front
- `peekFront()`: get the front item
- `peekEnd()`: get the end item

Suppose there're some people queuing to use ATM.

![](https://terry-su.github.io/BlogCDN/images/queue-for-atm.png)

- at end comes a new guy: `enqueue( person )`
- front guy has done and leave: `dequeue()`
- current front guy: `peekFront()`
- current last guy: `peekEnd()`

## Linked List

Linked list consists of nodes, and each node can have a link to another link, like a chain.

![](https://terry-su.github.io/BlogCDN/images/chain.jpg)

Mock its main concept via codes:

```js
const nodeC = { link: null };
const nodeB = { link: nodeC };
const nodeA = { link: nodeB };

const linkedList = { head: nodeA };
```
