# 前端面试指南

一份系统的前端面试资料，包含理论知识、实战经验和最佳实践。

## 📚 内容特点

- 📝 系统的知识梳理
- 💡 常见面试题解答
- 🔨 实用代码示例
- ⭐️ 最佳实践指南
- 🎯 性能优化建议

## 🗂 目录结构

```bash
docs/
├── frontend/           # 前端基础
│   ├── javascript/    # JavaScript 核心
│   ├── framework/     # 框架相关
│   │   ├── react/    # React 专题
│   │   ├── vue/      # Vue 专题
│   │   └── angular/  # Angular 专题
│   └── engineering/   # 工程化
├── backend/           # 后端知识
└── algorithm/         # 算法题解
```

## 🚀 快速开始

1. **克隆仓库**

```bash
git clone https://github.com/your-username/frontend-interview.git
```

2. **安装依赖**

```bash
pnpm install
```

3. **启动文档**

```bash
pnpm docs:dev
```

## 📖 核心内容

### React 专题

- React 基础概念
- Hooks 使用指南
- 性能优化策略
- 状态管理方案

### 工程化专题

- 构建工具
- 包管理器对比
- CI/CD 实践
- 性能监控

### 算法专题

- 常见算法题解
- 数据结构
- 复杂度分析

## 🤝 贡献指南

欢迎提交 PR 或 Issue 来完善这份面试资料！

1. Fork 本仓库
2. 创建特性分支
3. 提交改动
4. 发起 Pull Request

## 📝 文档编写规范

- 使用 Markdown 格式
- 代码示例需包含注释
- 重要概念需要配图说明
- 包含相关面试题

## 🔍 示例

```jsx
// React 组件示例
function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## 📱 联系方式

- Email: your-email@example.com
- GitHub: [your-username](https://github.com/your-username)

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件
