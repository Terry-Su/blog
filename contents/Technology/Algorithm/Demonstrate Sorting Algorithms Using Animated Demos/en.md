---
postTime: 2019/01/15 22:54
comment: <42>13</42>
<0>
</0>
---


![](https://terry-su.github.io/BlogCDN/images/simpson-evolution.jpg)    

<1>After learning common sorting algorithms, feel like demonstrating them using not only brief description but also animated demos.</1>

<2>Here contains 6 sorting algorithms, half are simple, half are advanced:</2>
* <3>Bubble sort</3>
* <4>Selection sort</4>
* <5>Insertion sort</5>
* ~
* <6>Merge sort</6>
* <7>Shell sort</7>
* <8>Quick sort</8>



## <9>Bubble sort</9>
<10>This maybe the simplest sort, notoriously slow though.</10>  
<11>Suppose we were arranging a queue of baseball players by their height. 
Start from leftmost.</11>
1. <12>compare two players</12> 
2. <13>if the one on the left is taller, swap them. Otherwise, no action.</13>
3. <14>move one position right</14>

<iframe src="https://terry-su.github.io/BlogCDN/iframes/algorithm/bubble-sort/index.html?mode=result" ></iframe>



## <15>Selection sort</15>
<16>Start from leftmost too.</16>
1. <17>look for shortest player from current position to right</17>
2. <18>swap shortest player with the player at current position</18>
2. <19>move one position right</19>

<iframe src="https://terry-su.github.io/BlogCDN/iframes/algorithm/selection-sort/index.html?mode=result" ></iframe>



## <20>Insertion sort</20>
<21>In most cases, this is the best of elementary sorts. It's about twice as fast as the bubble sort.</21>  
<22>The steps is somewhat complicated than sorts above.Start from leftmost.</22>
1. <23>partially sort left players</23>
2. <24>choose the first unsorted player as marked player</24>
3. <25>shift the players shorter than marked player to right</25>
4. <26>insert marked player into the previous  position of first shifted player.</26>

<iframe src="https://terry-su.github.io/BlogCDN/iframes/algorithm/insertion-sort/index.html?mode=result" ></iframe>




## <27>Merge sort</27>
<28>The heart of the merge sort algorithm are the merging of two already-sorted arrays and recursion.</28>  
![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Merge_sort_algorithm_diagram.svg/800px-Merge_sort_algorithm_diagram.svg.png)

<29>As shown in picture, main steps are:</29>
1. <30>Recur to split numbers into 2 parts</30>
2. <31>merge 2 parts</31>

<iframe src="https://terry-su.github.io/BlogCDN/iframes/algorithm/merge-sort/index.html?mode=result" ></iframe>



## <32>Shell sort</32>
<33>The name "Shell sort" is named for Donald Shell, who discovered it. It's based on **insertion sort**, but adds a new feature that dramatically improves the insertion sort's performance.</33>  

<34>Main steps</34>
1. <35>divide array into groups by interval(3 for example) and sort them continously until all items are divided and sorted.</35>
2. <36>diminish the interval and continue to divide and sort until the interval becomes 1.</36>

<iframe src="https://terry-su.github.io/BlogCDN/iframes/algorithm/shell-sort/index.html?mode=result" ></iframe>




## <37>Quick sort</37>
<38>In the majority of situations, this is the fastest sort.</38>

1. <39>choose a pivot(rightmost item)</39>
2. <40>partition the array into left sub array(smaller keys) and right sub array(larger keys)</40>
3. <41>recur step2 to left sub array and right sub array</41>

<iframe src="https://terry-su.github.io/BlogCDN/iframes/algorithm/quick-sort/index.html?mode=result" ></iframe>