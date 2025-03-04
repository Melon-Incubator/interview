### **一、作用域与闭包**

1. **变量提升陷阱**

```javascript
var a = 10;
function foo() {
  console.log(a);
  var a = 20;
}
foo(); // 输出？
```

**答案**：`undefined`  
**考点**：函数作用域提升优先级 > 全局变量

Q: 什么是作用域（变量）？  
A: 作用域（变量）：函数作用域，全局作用域，块作用域，严格模式下全局作用域。

Q: 为什么有作用域（变量）？  
A: 为什么有作用域（变量）？：因为函数、全局作用域、块作用域，严格模式下全局作用域，都是作用域，它们都可以存储变量。

Q: 什么是闭包？ 为什么有闭包？  
A: 闭包：闭包是一个函数，它引用了外部作用域（变量），并且这个函数返回了这个函数，这就是闭包。 闭包的优点：可以在函数外部访问函数内部的变量，可以实现封装，可以实现继承。

Q: 闭包内存泄漏？ 为什么有内存泄漏？  
A: 闭包内存泄漏：闭包引用的变量，函数，对象，数组，Date，RegExp，Function，Math，JSON，XMLHttpRequest，WebSocket，Event 等，会导致内存泄漏

2. **闭包内存泄漏**

```javascript
function createLeak() {
  const data = new Array(1000000);
  return function () {
    console.log("leak");
  };
}
// 如何避免内存泄漏？
```

**答案**：使用`WeakMap`替代闭包变量引用

```javascript
function createLeak() {
  const data = new WeakMap();
  data.set({}, new Array(1000000));
  return function () {
    console.log("leak");
  };
}
```

---

### **二、异步与事件循环**

3. **宏任务与微任务优先级**

```javascript
console.log(1);
setTimeout(() => console.log(2), 0);
Promise.resolve().then(() => console.log(3));
queueMicrotask(() => console.log(4));
console.log(5);
// 输出顺序？
```

**答案**：1 5 3 4 2  
**考点**：微任务队列执行顺序（原生 Promise > queueMicrotask）

Q: 介绍 JS 的事件循环机制：  
A: JS 的事件循环机制是指事件队列（macro task queue），处理宏任务（setTimeout，setInterval，setImmediate，Promise，queueMicrotask），微任务（Promise，queueMicrotask），以及 DOM 事件（DOMContentLoaded，load）。 宏任务的优先级比微任务高，JS 的执行会按照事件队列的优先级（宏任务 > 微任务）执行。

4. **async/await 执行顺序**

```javascript
async function async1() {
  console.log(1);
  await async2();
  console.log(2);
}
async function async2() {
  console.log(3);
}
async1();
new Promise((res) => {
  console.log(4);
  res();
}).then(() => console.log(5));
// 输出顺序？
```

**答案**：1 3 4 2 5  
**考点**：await 后的代码相当于在微任务中执行

---

### **三、原型与继承**

5. **原型链终点问题**

````javascript
function Foo() {}
const obj = new Foo();
// obj.__proto__ 是 Foo.prototype
// Foo.prototype.__proto__ 是 Object.prototype
// Object.prototype.__proto__ 是 null
console.log(obj.__proto__.__proto__.__proto__); // null

**答案**：`null`
```
**解析**：原型链：实例 → Foo.prototype → Object.prototype → null

Q: 什么是原型链？请详细介绍。
A: 原型链是一种对象之间共有的属性和方法的继承关系，它是对象的模式，用于实现继承的一种机制。
**解析**：原型链：实例 → Foo.prototype → Object.prototype → null

Q: 解释一下 prototype 和 __proto__ 的区别？
A: prototype 是每个函数的隐式参数，它指向该函数的原型对象。 __proto__ 是每个对象的内置属性，它指向该对象的原型对象。


6. **instanceof 原理手写**

```javascript
function myInstanceof(left, right) {
  // 补全代码
}
// 答案见下文
````

---

### **四、ES6+特性**

7. **箭头函数 this 绑定**

```javascript
const obj = {
  name: "obj",
  print: () => console.log(this.name),
  print2: function () {
    setTimeout(() => console.log(this.name), 0);
  },
};
obj.print(); // 输出？
obj.print2(); // 输出？
```

**答案**：undefined (浏览器环境)、obj  
**考点**：箭头函数没有自己的 this，继承外层作用域

8. **解构赋值陷阱**

```javascript
let { a: x, b: y } = { a: 1, b: 2 };
console.log(x, y); // 输出？
```

**答案**：1 2  
**考点**：对象解构的`{源属性: 目标变量}`语法

---

### **五、进阶手写实现**

9. **实现 Promise.all**

```javascript
function promiseAll(promises) {
  // 补全代码（需处理错误）
}
```

10. **实现函数柯里化**

```javascript
function curry(fn) {
  // 补全代码
}
```

---

### **六、代码输出分析**

11. **块级作用域+闭包**

```javascript
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}
// 输出？
```

**答案**：0 1 2  
**对比**：将`let`改为`var`输出什么？（答案：3 3 3）

12. **Proxy 拦截陷阱**

```javascript
const proxy = new Proxy(
  {},
  {
    get(target, prop) {
      return prop in target ? target[prop] : 42;
    },
  }
);
console.log(proxy.undefinedProp); // 输出？
```

**答案**：42  
**考点**：Proxy 的 get 捕获器行为

---

### **七、其他核心概念**

13. **内存管理**

```javascript
function createClosure() {
  const data = new Array(1000000);
  return function () {
    return data[(Math.random() * 1000000) | 0];
  };
}
// 如何手动解除data的引用？
```

**答案**：在不需要时设置`data = null`

14. **模块化差异**

```javascript
// 以下两种导出方式有何区别？
export default function () {}
export function foo() {}
```

**答案**：default 导出可任意命名，具名导出必须使用原名称导入

---

### **八、设计模式**

15. **单例模式实现**

```javascript
class Singleton {
  static getInstance() {
    // 补全代码
  }
}
```

---

### **九、综合应用题**

16. **实现观察者模式**

```javascript
class EventEmitter {
  constructor() {
    /* 初始化存储结构 */
  }
  on(event, listener) {
    /* 补全 */
  }
  emit(event, ...args) {
    /* 补全 */
  }
}
```

---

### **十、陷阱题**

17. **隐式类型转换**

```javascript
console.log([] == ![]); // 输出？
```

**答案**：true  
**解析**：![] → false → []转为 0，false 转为 0 → 0 == 0

18. **严格模式差异**

```javascript
"use strict";
function fn() {
  console.log(this);
}
fn(); // 输出？
```

**答案**：undefined  
**对比**：非严格模式输出 window/global

---

### **答案速查**

6. **instanceof 手写实现**

```javascript
function myInstanceof(left, right) {
  let proto = Object.getPrototypeOf(left);
  const prototype = right.prototype;
  while (proto) {
    if (proto === prototype) return true;
    proto = Object.getPrototypeOf(proto);
  }
  return false;
}
```
