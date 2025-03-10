## 双线程模型

小程序运行时采用双线程模型，分别处理逻辑层和渲染层的任务。

- **ServiceJSBridge**：负责逻辑层的执行，处理 JavaScript 代码和 API 调用。
- **RenderJSBridge**：负责渲染层的执行，处理 TYML/TYSS 代码和组件渲染。

小程序作为一个容器技术，视图层运行在容器 WebView 中，逻辑层运行在 JSCore 中，渲染线程和逻辑线程分离且不能直接通信，需要通过消息桥（MessageBridge）进行通信。

#### MessageBridge

消息桥（MessageBridge）是小程序运行时的统一通信层，负责线程间的消息传递，消息通过 JSON 格式在两个线程之间传递。

```ts
interface MessageBridge {
  send(message: string): void;
  on(message: string, callback: (data: any) => void): void;
}
```
