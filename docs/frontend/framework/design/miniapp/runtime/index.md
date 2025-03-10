# 小程序运行时

- [双线程模型](./service-view-bridge.md)：基于 ServiceJSBridge 和 RenderJSBridge 实现逻辑与渲染分离。
- [自定义 AMD 模块系统](./amd.md)：实现 define/require 机制，支持运行时模块异步加载。
- [Virtual DOM Renderer](./virtual-dom-renderer.md)：自研虚拟 DOM 树和差异算法，实现高效渲染。
- [统一通信层](./message-bridge.md)：使用 MessageBridge 实现线程间通信，支持事件订阅、消息分发。
- [统一 API 层](./capability-extension.md)：封装原生 API，提供一致性接口。
- [能力扩展体系](./capability-extension.md)：支持云能力、原生路由、业务组件接入。
- [插件化设计](./plugin.md)：实现 AppPlugin 架构，支持 vConsole、IDE、审计工具等插件集成。
- [安全沙箱](./safe-script.md)：实现 SafeScript 执行环境，防止 XSS 和代码注入。
- [质量与性能保障](./quality-performance.md)：Jest 单元测试覆盖、指标监控、性能评分工具等。
