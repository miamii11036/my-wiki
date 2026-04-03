---
title: "9佇列Queue"
public_title: "佇列 Queue"
date: 2026-04-03
tags: [data-structure, queue]
public: true
aliases: [9佇列Queue]
---

佇列是一個由左至右的線性結構，它就像一條水管，資料統一從一端進入，從另一端離開，因此必須遵守<mark>**【先進先出FIFO】**</mark>原則。
正因如此，<mark>無法讀取中間的資料</mark>，只能先把出口端的資料移出，才能取得中間的資料
+ 把資料從一端推入佇列的過程稱為enqueue
+ 把資料從另一端移出佇列的過程稱為dequeue
+ 資料進入的入口端稱為Rear，通常在佇列尾端
+ 資料移出的出口端稱為Front，通常在佇列頭端
+ 查看頭端資料的過程稱為Peek

|端點|別名|負責|
|---|---|---|
|**Front**（前端/頭端）|Head|Dequeue，資料出口|
|**Rear**（後端/尾端）|Tail / Back|Enqueue，資料入口|

使用佇列的好處是enqueue、dequeue、Peek的操作複雜度皆為O(1)
