---
postTime: 2019/01/15 22:54
comment: 5

title: 动画演绎排序算法


components:
  TestApp: TestApp.js

---

<TestApp />

![](https://terry-su.github.io/BlogCDN/images/simpson-evolution.jpg)    

在学习了常用的排序算法之后，打算用动画Demo来生动形象的展现它们。

这里包含6种排序算法，其中一半是简单算法，另一半是高级算法:
* 冒泡排序
* 选择排序
* 插入排序
* ~
* 归并排序
* 希尔排序
* 快速排序



## 冒泡排序
这可能是最简单的一种，但是速度非常慢。  
假设我们按照棒球运动员的身高来排列队列。从最左边开始。
1. 比较两个球员 
2. 如果左边的高一些，就换掉。否则,不做任何操作。
3. 向右移动一个位置

<div>

</div>


## 选择排序
也从最左边开始。
1. 寻找从当前位置到右边的最矮球员
2. 将最矮球员与当前位置的球员交换
2. 向右移动一个位置

<iframe src="https://terry-su.github.io/BlogCDN/iframes/algorithm/selection-sort/index.html?mode=result" ></iframe>



## 插入排序
在大多数情况下，这是基础排序方法中的最佳方法。它的速度是冒泡排序的两倍。  
而具体步骤比上面的排序稍微复杂一些。从左边的开始。
1. 部分排序左球员
2. 选择第一个未排序的球员作为标记球员
3. 将比标记球员矮的球员移到右边
4. 将标记的球员插入到第一个移动过位置的球员的前一个位置。

<iframe src="https://terry-su.github.io/BlogCDN/iframes/algorithm/insertion-sort/index.html?mode=result" ></iframe>




## 合并排序
合并排序算法的核心是两个已经排序的数组的合并和递归。  
![](https://upload.wikimedia.org/wikipedia/commons/thumb/e/e6/Merge_sort_algorithm_diagram.svg/800px-Merge_sort_algorithm_diagram.svg.png)

如图所示，主要步骤如下:
1. 将数字分成两部分
2. 合并两部分

<iframe src="https://terry-su.github.io/BlogCDN/iframes/algorithm/merge-sort/index.html?mode=result" ></iframe>



## 希尔排序
“Shell排序”的名称是以发现它的Donald Shell命名的。它基于**插入排序**，但是增加了一个新特性，从而极大地提高了插入排序的性能。  

主要步骤
1. 将数组按区间(例如3)划分为若干组，并对它们进行一直排序，直到所有元素都被划分和排序为止。
2. 缩小区间，继续进行分割和排序，直到区间变为1。

<iframe src="https://terry-su.github.io/BlogCDN/iframes/algorithm/shell-sort/index.html?mode=result" ></iframe>




## 快速排序
在大多数情况下，这是最快的排序。

1. 选择一个参考元素(最右边的元素)
2. 将数组划分为左子数组(比参考元素小的所有元素)和右子数组(比参考元素大的所有元素)
3. 对左子数组和右子数组重复步骤2

<iframe src="https://terry-su.github.io/BlogCDN/iframes/algorithm/quick-sort/index.html?mode=result" ></iframe>