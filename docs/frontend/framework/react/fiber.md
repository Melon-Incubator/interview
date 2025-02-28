# React Fiber 架构 - 面试指南

## 核心概念

### React15 vs React16 架构对比

🤔 **面试题：React15 和 React16 架构有什么区别？为什么要进行架构重构？**

✅ **答案：**

1. **架构层面的区别：**

   - React15：双层架构

     - Reconciler（协调器）—— 找出变化的组件
     - Renderer（渲染器）—— 渲染变化的组件

   - React16：三层架构
     - Scheduler（调度器）—— 调度任务优先级
     - Reconciler（协调器）—— 找出变化的组件
     - Renderer（渲染器）—— 渲染变化的组件

2. **重构原因：**

   - React15 的问题：递归更新，无法中断
   - React16 的改进：可中断的更新

   ```js
   // React15 的问题：递归更新，无法中断
   function RecursiveUpdate(fiber) {
     updateComponent(fiber);
     if (fiber.child) {
       RecursiveUpdate(fiber.child);
     }
   }

   // React16 的改进：可中断的更新
   function FiberUpdate(fiber) {
     while (fiber) {
       if (shouldYield()) {
         // 判断是否需要让出主线程
         return fiber; // 返回未完成的fiber节点
       }
       fiber = performUnitOfWork(fiber);
     }
   }
   ```

3. **React15 的主要问题：**
   - 递归更新，无法中断
   - 掉帧，导致页面卡顿
   - 无法调度任务优先级

🤔 **面试题：Scheduler（调度器）的作用是什么？**

✅ **答案：**

1. 调度任务优先级
2. 控制任务执行时机
3. 实现时间切片
4. 保证高优先级任务优先执行

````js
// 示例：Scheduler 如何区分优先级
const priorities = {
  ImmediatePriority: 1,  // 最高优先级，需要同步执行
  UserBlockingPriority: 2,  // 用户交互
  NormalPriority: 3,  // 普通优先级
  LowPriority: 4,  // 低优先级
  IdlePriority: 5,  // 空闲优先级
};

// 任务调度示例
scheduleCallback(UserBlockingPriority, () => {
  // 用户输入、动画等交互任务
});

## React Fiber 架构

在 React15 及以前，Reconciler 采用递归的方式创建虚拟 DOM，递归过程是不能中断的。如果组件树的层级很深，递归会占用线程很多时间，造成卡顿。

为了解决这个问题，React16 将递归的无法中断的更新重构为异步的可中断更新，由于曾经用于递归的虚拟 DOM 数据结构已经无法满足需要。于是，全新的 Fiber 架构应运而生。

### Fiber 包含三层含义：

[React 官方 reconcilers 解释](https://zh-hans.legacy.reactjs.org/docs/codebase-overview.html#reconcilers)

作为架构来说，之前 React15 的 Reconciler 采用递归的方式执行，数据保存在递归调用栈中，所以被称为 stack Reconciler。React16 的 Reconciler 基于 Fiber 节点实现，被称为 Fiber Reconciler。

作为静态的数据结构来说，每个 Fiber 节点对应一个 React element，保存了该组件的类型（函数组件/类组件/原生组件...）、对应的 DOM 节点等信息。

作为动态的工作单元来说，每个 Fiber 节点保存了本次更新中该组件改变的状态、要执行的工作（需要被删除/被插入页面中/被更新...）。

### Fiber Reconciler

它的主要目标是：

- 能够把可中断的任务切片处理。
- 能够调整优先级，重置并复用任务。
- 能够在父元素与子元素之间交错处理，以支持 React 中的布局。
- 能够在 render() 中返回多个元素。
- 更好地支持错误边界。

### Fiber 的结构

[Fiber Node 的属性定义](https://github.com/facebook/react/blob/1fb18e22ae66fdb1dc127347e169e73948778e5a/packages/react-reconciler/src/ReactFiber.new.js#L117)，虽然属性很多，但我们可以按三层含义将他们分类来看。

```js
class FiberNode {
  // 作为静态数据结构的属性，
  // 保存了组件相关的信息
  type: any; // React element
  key: null | string;
  elementType: any; // React element
  tag: WorkTag; // 节点类型
  stateNode: any; // DOM 节点

  // 用于连接其他Fiber节点形成Fiber树
  return: Fiber | null; // 父节点
  child: Fiber | null;  // 第一个子节点
  sibling: Fiber | null; // 下一个兄弟节点
  index: number; // 兄弟节点的索引

  // 作为动态的工作单元的属性
  pendingProps: any; // 未来的props
  memoizedProps: any; // 本次更新的props
  memoizedState: any; // 本次更新的state
  updateQueue: UpdateQueue<any> | null; // 本次更新的队列

  // 副作用
  flags: Flags; // 副作用标识
  subtreeFlags: Flags; // 子树副作用标识
  deletions: Array<Fiber> | null; // 需要删除的fiber节点

  // 调度优先级相关
  lanes: Lanes; // 调度优先级
  childLanes: Lanes; // 子树调度优先级

  // 在Fiber树更新的过程中，每个Fiber都会有一个跟其对应的Fiber
  // 我们称他为`current <==> workInProgress`
  alternate: Fiber | null;

  // 调试相关的信息
  actualDuration?: number; // 实际执行的时间
  actualStartTime?: number; // 实际开始的时间
  selfBaseDuration?: number; // 自身基准时间
  treeBaseDuration?: number; // 树基准时间
}
````

## Fiber 的生命周期

Fiber 节点的生命周期可以分为三个阶段：

- mounting: 挂载阶段
- updating: 更新阶段
- unmounting: 卸载阶段

### 挂载阶段

Fiber 节点在挂载阶段会执行以下操作：

1. 创建 DOM 节点
2. 将 DOM 节点插入到父 DOM 节点中
3. 设置 DOM 节点的属性
4. 返回 Fiber 节点

### 更新阶段

Fiber 节点在更新阶段会执行以下操作：

1. 更新 DOM 节点的属性
2. 返回 Fiber 节点

### 卸载阶段

Fiber 节点在卸载阶段会执行以下操作：

1. 移除 DOM 节点
2. 返回 Fiber 节点

## Fiber 的工作流程

### 双缓存与 Fiber 树

双缓存（double buffering）是一种优化策略，它在两个不同的渲染中重用 DOM 树。React 利用这一策略来完成 Fiber 树的构建与替换，从而实现 DOM 树的创建与更新。

在 React 中，我们可以将 Fiber 树分为两种：

1. current 树：当前屏幕上显示内容对应的 Fiber 树。
2. workInProgress 树：正在内存中构建的 Fiber 树。

这两棵树通过 alternate 属性相连。React 在 workInProgress 树上进行更新操作，完成后会将 workInProgress 树替换为 current 树，这个过程就是双缓存。

### Fiber 的工作流程

Fiber 的工作流程主要包含两个阶段：

1. 构建阶段（Render Phase）：

   - 创建 workInProgress 树
   - 对比 current 树和新的 React element，找出需要更新的部分
   - 为需要更新的 Fiber 节点打上标记

2. 提交阶段（Commit Phase）：
   - 将构建阶段的结果应用到 DOM 上
   - 调用生命周期方法和钩子函数
   - 将 workInProgress 树变为 current 树

这种分阶段的方式使得 React 能够实现可中断的渲染，提高应用的响应性和性能。

## 总结

Reconciler 工作的阶段被称为 render 阶段，因为在该阶段会调用组件的 render 方法。
Renderer 工作的阶段被称为 commit 阶段，就像你完成一个需求的编码后执行 git commit 提交代码。commit 阶段会把 render 阶段提交的信息渲染在页面上。
render 与 commit 阶段统称为 work，即 React 在工作中。相对应的，如果任务正在 Scheduler 内调度，就不属于 work。

## 面试题

1. Fiber 的作用是什么？它与 React 传统的调度方式有什么不同？
   考察点：理解 Fiber 的核心作用，尤其是在渲染调度方面的变化，以及它如何解决传统 React 更新中的性能瓶颈问题。
2. 解释什么是 Fiber 树？它如何影响 React 渲染流程？
   考察点：考察面试者对 Fiber 树结构的理解，以及如何将 Fiber 树与传统的虚拟 DOM 树作对比。
3. 什么是 React Fiber 中的时间分片（Time Slicing）？它如何帮助提升性能？
   考察点：面试者是否能详细阐述 React Fiber 的调度机制，如何通过时间分片来避免长时间的主线程阻塞，提高渲染的响应性。
4. Fiber 如何处理优先级更新？举例说明 React 在渲染过程中如何根据优先级进行调度。
   考察点：面试者是否理解 React Fiber 的优先级调度机制，并能够通过实际案例解释它如何优化性能，保证关键更新的及时渲染。
5. 描述 React 中的挂起（Suspense）与 Fiber 的关系，Suspense 如何通过 Fiber 改进异步渲染？
   考察点：考察面试者对 Suspense 和 Fiber 的关系的理解，特别是如何通过 Fiber 更好地支持异步渲染和代码拆分。
