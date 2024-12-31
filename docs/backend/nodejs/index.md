# Node.js 开发指北

欢迎来到 Node.js 开发专区。这里你将找到构建可扩展后端应用的指北和最佳实践。

## 快速开始

Node.js 是基于 Chrome V8 引擎的 JavaScript 运行时。让我们探索基础知识：

```javascript
const http = require("http");

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" });
  res.end("你好，Melon 技术孵化器！");
});

server.listen(3000);
```

## 核心特性

- 事件驱动架构
- 非阻塞 I/O
- NPM 生态系统
- 跨平台支持
- 微服务架构支持
