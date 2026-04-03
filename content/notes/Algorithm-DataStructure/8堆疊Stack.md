---
title: "8堆疊Stack"
public_title: "堆疊 Stack"
date: 2026-04-03
tags: [data-structure, stack]
public: true
aliases: [8堆疊Stack]
---

堆疊是一種<mark>由下往上</mark>的線性結構，它就像一個桶子，所有資料皆從<mark>同一端（頂端）進入與離開</mark>，因此必須遵守<mark>【後進先出LIFO】</mark>原則
正因如此，<mark>無法讀取中間或底層的資料</mark>，必須先把頂端的資料移走，才能知道中間或底層資料的內容
+ 資料的進入過程稱為<mark>**Push（推入）**</mark>，資料由下而上疊起來
+ 資料的離開過程稱為<mark>**Pop（彈出）**</mark>，頂端的資料必須先移走，才能取得底下的資料
+ 只查看頂端資料的過程稱為<mark>**Peek**</mark>

使用堆疊的好處在於 <mark>Push、Pop、Peek的複雜度都是O(1)</mark>
# 應用
|場景|為什麼用 Stack|
|---|---|
|函式呼叫 / 遞迴|每次呼叫壓入，回傳時彈出，天然 LIFO|
|括號匹配 `()[]{}`|遇到左括號 push，遇到右括號 pop 比對|
|瀏覽器上一頁|每次跳頁 push，按返回鍵 pop|
|復原 Undo 功能|每個操作 push，Undo 就 pop|
