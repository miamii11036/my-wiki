---
title: "Primitive Variable V.S Reference Variable"
description: "兩種Java變數的基礎"
pubDatetime:
tags: [java, knowhow]
draft: false
---

在Java中，變數可以根據儲存的內容分為 Primitive 與 Reference。
# Primitive
儲存Value本身並存放在一個名為<mark>Stack</mark>的記憶體中
- 能做為Primitive的DataType有 int、double、char(字元)、boolean
- 宣告變數時用<mark>小寫</mark>
    ```java
    int year = 6;
    double price = 4.99;
    char currency = '$';
    boolean isValid = true;
    ```
- Primitive變數是<mark>獨立存在</mark>的，所以用某變數的值宣告變數，新的變數值發生的改變不會影響原本的變數
    ```java
    int a = 6;
    int b = a;
    System.out.println(b); //輸出6
    System.out.println(a); //輸出6

    b = 10;
    System.out.println(b); //輸出10
    System.out.println(a); //輸出6
    ```
    ```
    ┌─────────────────┐
    │      STACK      │ 
    ├─────────────────┤  
    │ a → 6           │
    │ b → 6           │     
    └─────────────────┘ 
    ```
- 因此，若沒有賦值給Primitive變數，則輸出為<mark> 0 or false </mark>

# Reference
儲存<mark>Heap的位址</mark>，而非Value本身，並且變數本身也存放在名為Stack的記憶體中
- 能做為Reference的DataType有 String、Array、Object(物件)
- 宣告變數實用<mark>大寫</mark>
    ```java
    String name = "Miliya"
    int[] a = {1, 2, 3};
    ```
- 由於Reference儲存的是Stack的位址，所以兩個變數都指向同一個位址，當其中一個變數值發生改變，會影響另一個變數的值
    ```java
    int[] a = {1,2,3};
    int[] b = a;
    System.out.println(b[0]); //輸出1
    System.out.println(a[0]); //輸出1

    b[0] = 99;

    System.out.println(b[0]); //輸出99
    System.out.println(a[0]); //輸出99
    ```
    ```
    ┌─────────────────┐        ┌─────────────────────┐
    │      STACK      │        │        HEAP         │
    ├─────────────────┤        ├─────────────────────┤
    │  a → 0x001   ───┼──┬────▶│  [1, 2, 3]          │
    │  b → 0x001   ───┼──┘     │                     │
    └─────────────────┘        └─────────────────────┘
    當執行 b[0] = 99;後
    ┌─────────────────┐         ┌─────────────────────┐
    │      STACK      │         │        HEAP         │
    ├─────────────────┤         ├─────────────────────┤
    │  a → 0x001   ───┼──┬────▶ │  [99, 2, 3]         │
    │  b → 0x001   ───┼──┘      │   ↑                 │
    └─────────────────┘         │  修改 index 0 為 99  │
                                └─────────────────────┘
    ```
- 因此，若沒有賦值給Reference變數，則輸出為 null