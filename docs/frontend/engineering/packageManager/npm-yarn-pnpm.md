# npm、yarn、pnpm 的区别

## 1. 基本概念

### 1.1 包管理器简介

> 面试题：npm、yarn、pnpm 有什么区别？各自的优势是什么？

```bash
# npm (Node Package Manager)
npm install lodash

# Yarn (Yet Another Resource Navigator)
yarn add lodash

# pnpm (Performant NPM)
pnpm add lodash
```

### 1.2 依赖安装策略

```bash
# 依赖目录结构
├── node_modules
│   ├── lodash       # npm/yarn: 平铺
│   └── .pnpm        # pnpm: 硬链接
└── package.json
```

## 2. 主要特性对比

### 2.1 依赖管理

```json
{
  "dependencies": {
    // npm/yarn v1: 嵌套依赖
    "package-a": "1.0.0",

    // yarn v4/pnpm: 支持工作空间
    "workspaces": ["packages/*"]
  }
}
```

| 特性       | npm  | Yarn v1 | Yarn v4  | pnpm   |
| ---------- | ---- | ------- | -------- | ------ |
| 依赖解析   | 嵌套 | 平铺    | 即插即用 | 硬链接 |
| 并行安装   | ✅   | ✅      | ✅       | ✅     |
| 离线缓存   | ✅   | ✅      | ✅       | ✅     |
| 确定性安装 | ❌   | ✅      | ✅       | ✅     |
| 零安装     | ❌   | ❌      | ✅       | ❌     |
| 工作空间   | ✅   | ✅      | ✅       | ✅     |

### 2.2 性能对比

```bash
# 安装速度比较（示例）
npm install           # 100s
yarn install         # 80s
pnpm install         # 30s

# 磁盘空间使用
node_modules 大小：
npm/yarn: ~1GB
pnpm: ~300MB
```

## 3. 特性详解

### 3.1 Yarn v4 新特性

```yaml
# .yarnrc.yml
# Yarn v4 配置示例

# 启用新特性
enableGlobalCache: true
nodeLinker: node-modules

# 零安装配置
enableZeroInstalls: true

# 插件系统
plugins:
  - path: .yarn/plugins/@yarnpkg/plugin-typescript.cjs
    spec: "@yarnpkg/plugin-typescript"
```

主要改进：

1. **零安装**：

   - 提交 `.yarn/cache` 到版本控制
   - 无需运行 `yarn install`
   - 更快的 CI/CD

2. **插件系统**：

   - 可扩展架构
   - 自定义工作流
   - 更好的工具集成

3. **构建系统优化**：
   - 更快的依赖解析
   - 更好的缓存策略
   - 支持 ESM

### 3.2 pnpm 特性

```bash
# pnpm 工作空间示例
pnpm-workspace.yaml:
packages:
  - 'packages/*'
  - 'apps/*'

# 硬链接复用
.pnpm/
  lodash@4.17.21/
  react@18.0.0/
```

优势：

1. **节省磁盘空间**：

   - 通过硬链接共享依赖
   - 避免重复安装

2. **更严格的依赖管理**：

   - 防止幽灵依赖（什么是幽灵依赖？）
     - 幽灵依赖是指在项目中没有明确声明，但被其他依赖间接依赖的包。
   - 更清晰的依赖树

3. **更快的安装速度**：
   - 并行安装
   - 更好的缓存策略

## 4. 最佳实践

### 4.1 选择建议

```bash
# 推荐使用场景

# 1. 单体应用
npm/yarn v1: 简单项目
pnpm: 注重性能和空间

# 2. Monorepo
yarn v4: 完整工具链
pnpm: 高性能需求

# 3. CI/CD
yarn v4: 零安装特性
pnpm: 快速安装
```

### 4.2 锁文件对比

```bash
# npm
package-lock.json

# yarn v1/v4
yarn.lock

# pnpm
pnpm-lock.yaml
```

### 4.3 常见问题处理

```bash
# 1. 依赖冲突解决
npm ls package-name
yarn why package-name
pnpm why package-name

# 2. 缓存清理
npm cache clean --force
yarn cache clean
pnpm store prune

# 3. 版本升级
npm update
yarn up
pnpm update
```
