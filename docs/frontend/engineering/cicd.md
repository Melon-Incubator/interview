# 持续集成（CI）、持续交付（CD）

## **基础概念**

### **1. 持续集成（CI）、持续交付（CD）有什么区别？**

✅ **考察点**：CI/CD 基础概念，区别和联系。

✅ **示例回答**：

- **持续集成（CI）**：开发人员频繁合并代码到主分支，并自动运行测试，确保代码质量和兼容性。
- **持续交付（CD）**：CI 之后的步骤，代码部署到**类生产环境**（staging），但**需要人工批准**才能上线。

📌 **简化理解**：
CI（合并代码 + 自动测试） → CD（自动打包 + 预发布）

---

### **2. CI/CD 主要解决什么问题？**

✅ **考察点**：CI/CD 的实际作用，是否理解 DevOps 思维。

✅ **示例回答**：
CI/CD 解决了：

1. **代码质量问题**：每次合并代码都会触发自动化测试，防止 Bug 进入主分支。
2. **环境不一致问题**：CI/CD 确保测试、预发布、生产环境一致，减少“这代码在我电脑上没问题”情况。
3. **部署繁琐问题**：自动化部署减少人为错误，提高效率。
4. **交付缓慢问题**：提高迭代速度，快速发布新功能。

---

## **CI/CD 工具**

### **3. CI/CD 常用的工具有哪些？你用过哪些？**

✅ **考察点**：对主流 CI/CD 工具的熟悉度，是否有实际经验。

✅ **示例回答**：
**常见 CI/CD 工具**：

- **Jenkins**（最流行，支持插件丰富）
- **GitHub Actions**（GitHub 原生支持，适合开源项目）
- **GitLab CI/CD**（GitLab 内置，和 GitLab 仓库高度集成）
- **CircleCI**（云端 CI/CD，易于集成）
- **Travis CI**（适用于 GitHub，易上手）
- **ArgoCD**（GitOps 持续部署）

📌 **实际经验**：

> “我主要用 GitLab CI/CD 配合 Kubernetes（K8s）做自动化部署，也用过 GitHub Actions 进行前端项目的 CI/CD。”

---

### **4. 你如何在 GitLab CI/CD 里控制合并请求的权限？**

✅ **考察点**：CI/CD 结合 Git 权限管理，是否具备实际操作经验。

✅ **示例回答**：
在 GitLab CI/CD 里，可以用 **规则** 控制合并权限：

1. **限制开发者合并权限**：

   ```yaml
   rules:
     - if: '$CI_COMMIT_BRANCH == "main"'
       allow_failure: false
       when: manual
   ```

   📌 **解释**：如果是 `main` 分支，必须手动批准（防止直接合并）。

2. **根据文件变更控制合并权限**：
   ```yaml
   rules:
     - changes:
         paths:
           - "config/**"
       when: never
   ```
   📌 **解释**：如果 `config` 目录变更，则阻止合并（例如配置文件需要维护者审核）。

---

## **CI/CD 流程**

### **5. CI/CD 的典型流程是什么？**

✅ **考察点**：是否了解 CI/CD 的完整生命周期。

✅ **示例回答**：
CI/CD 典型流程：

1. **开发（Dev）**：开发人员提交代码到 Git。
2. **持续集成（CI）**：
   - 触发构建（npm build / Docker 构建）
   - 运行自动化测试（单元测试、E2E 测试）
   - 代码质量检查（ESLint、Prettier、SonarQube）
3. **持续交付（CD）**：
   - 生成制品（Artifact/Docker 镜像）
   - 部署到 Staging（预发布环境）
   - 人工审批
4. **持续部署（CD）**：
   - 自动发布到生产环境
   - 监控日志、健康检查

📌 **示例 CI/CD 流程**

```yaml
stages:
  - build
  - test
  - deploy

build:
  script:
    - npm install
    - npm run build

test:
  script:
    - npm test

deploy:
  script:
    - npm run deploy
```

---

### **6. 如何在 CI/CD 过程中进行回滚？**

✅ **考察点**：应对线上故障的能力，熟悉 GitOps 或 Kubernetes。

✅ **示例回答**：
有几种方式进行回滚：

1. **Git 回滚**：

   ```sh
   git revert HEAD
   git push origin main
   ```

   📌 **适用场景**：代码问题，快速恢复到上一个版本。

2. **Docker/K8s 回滚**：

   ```sh
   kubectl rollout undo deployment my-app
   ```

   📌 **适用场景**：容器化应用，可以一键回滚到上一个版本。

3. **蓝绿部署**：
   - 生产环境同时运行 `v1` 和 `v2`
   - 发现 `v2` 有问题，切回 `v1`  
     📌 **适用场景**：无缝切换版本，用户无感知。

---

## **CI/CD 进阶**

### **7. 如何优化 CI/CD 执行速度？**

✅ **考察点**：性能优化，避免 CI/CD 变慢影响开发效率。

✅ **示例回答**：

1. **缓存依赖**（避免重复安装 npm/yarn 依赖）
   ```yaml
   cache:
     paths:
       - node_modules/
   ```
2. **并行执行任务**
   ```yaml
   test:
     script:
       - npm run lint &
       - npm run test &
   ```
3. **使用轻量级 Docker 镜像**
   ```dockerfile
   FROM node:18-alpine
   ```
4. **跳过不必要的 Job**
   ```yaml
   rules:
     - if: '$CI_COMMIT_BRANCH != "main"'
       when: never
   ```

---

### **8. 如何在 CI/CD 里管理敏感信息（如 API Key）？**

✅ **考察点**：安全性，如何管理环境变量。

✅ **示例回答**：

- **GitLab/GitHub Secrets**（存储环境变量）
- **Kubernetes Secrets**（存储 API Key，避免明文存储）
- **Vault（HashiCorp）**（管理敏感信息）

示例：

```yaml
script:
  - echo "API_KEY=$API_KEY" >> .env
```

---

### **9. 如何在 CI/CD 里进行灰度发布？**

✅ **考察点**：部署策略，是否理解 Canary 发布。

✅ **示例回答**：

- **Canary 发布**：先部署给 10% 用户，如果没问题再全量发布。
- **Kubernetes 方式**：
  ```yaml
  strategy:
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 10%
  ```

---

### **10. 你如何在 CI/CD 中监控和诊断部署问题？**

✅ **考察点**：日志、监控、告警系统。

✅ **示例回答**：

- **ELK（Elasticsearch + Kibana + Logstash）**
- **Prometheus + Grafana**（实时监控）
- **Sentry**（错误监控）
- **Slack/Webhook**（部署失败通知）

以下是 **CI/CD（持续集成/持续交付）发布安全** 相关的 **10 道经典面试题**，涵盖 **代码审计、凭证管理、供应链安全、部署策略、回滚机制** 等核心考点。

## 安全相关

### **1. CI/CD 中如何防止恶意代码注入？**

✅ **考察点**：代码审计、静态分析、代码评审机制。

✅ **示例回答**：
**防御措施**：

1. **代码审查（Code Review）**：所有合并请求必须经过 **至少 2 人审核**。
2. **静态代码扫描（SAST）**：
   ```yaml
   jobs:
     security-scan:
       script:
         - sonar-scanner
   ```
3. **签署提交（Commit Signing）**：要求开发者使用 GPG 签名提交代码，确保身份可信。
   ```sh
   git commit -S -m "secure commit"
   ```

---

### **2. 如何防止 CI/CD 过程中敏感信息泄露？**

✅ **考察点**：环境变量管理、凭证存储安全。

✅ **示例回答**：

1. **避免硬编码**：不要在代码中存储 API Key、密码等敏感信息。
2. **使用 GitLab / GitHub Secret 存储凭据**：
   ```yaml
   env:
     DATABASE_URL: ${{ secrets.DATABASE_URL }}
   ```
3. **加密 CI/CD 变量**，防止泄露：
   ```sh
   echo "API_KEY=xxx" | gpg --encrypt --recipient "ci-server"
   ```

---

### **3. 如何防止 CI/CD 过程中供应链攻击？**

✅ **考察点**：第三方依赖管理、安全性审查。

✅ **示例回答**：

1. **使用 `package-lock.json` / `yarn.lock` 固定依赖版本**，防止被篡改：
   ```sh
   npm ci
   ```
2. **定期扫描依赖漏洞**：
   ```sh
   npm audit fix
   ```
3. **使用私有 npm / 镜像仓库**：
   ```sh
   npm set registry https://private-registry.com
   ```

---

### **4. CI/CD 过程中如何确保构建环境安全？**

✅ **考察点**：容器安全、CI/CD 运行环境隔离。

✅ **示例回答**：

1. **使用最小权限原则**，CI/CD 运行时不使用 `root` 用户：
   ```dockerfile
   USER node
   ```
2. **构建环境隔离**，使用 Docker Sandbox 运行 CI/CD 任务：
   ```yaml
   jobs:
     build:
       image: node:18
   ```
3. **定期扫描 CI/CD 服务器上的恶意软件**：
   ```sh
   clamscan -r /var/lib/jenkins
   ```

---

### **5. 如何防止 CI/CD 过程中的人为错误？**

✅ **考察点**：发布审批机制、回滚策略。

✅ **示例回答**：

1. **多级审批流程**：
   - 仅 **管理员** 才能触发生产环境部署：
     ```yaml
     jobs:
       deploy:
         rules:
           - if: $CI_COMMIT_BRANCH == "main" && $USER_ROLE == "admin"
     ```
   - 代码变更后，必须经 **Code Review + QA 测试 + 批准**。
2. **发布自动回滚**：
   - 采用 **蓝绿部署**，如果新版本异常，自动回滚到旧版本：
     ```sh
     kubectl rollout undo deployment web-app
     ```

---

### **6. 如何防止 CI/CD 过程中代码被篡改？**

✅ **考察点**：代码完整性校验。

✅ **示例回答**：

1. **启用 Git 保护分支**，防止直接修改：
   ```sh
   git branch --set-upstream-to=origin/main --force
   ```
2. **代码提交签名**：
   ```sh
   git commit -S -m "Signed commit"
   ```
3. **构建后 Hash 校验**，确保产物未被篡改：
   ```sh
   sha256sum build/output.js
   ```

---

### **7. 如何防止恶意 PR 进入 CI/CD？**

✅ **考察点**：PR 保护策略、自动检查。

✅ **示例回答**：

1. **限制外部贡献者权限**，防止未授权用户直接触发 CI/CD。
2. **所有 PR 必须通过静态代码扫描（SAST）**：
   ```yaml
   jobs:
     code-scan:
       script:
         - sonar-scanner
   ```
3. **PR 保护策略**：
   - 必须通过所有 CI 检查
   - 需要 **至少 2 人审批**
   - 限制 **合并到主分支的权限**

---

### **8. 如何防止 CI/CD 过程中私钥泄露？**

✅ **考察点**：密钥管理、最小权限原则。

✅ **示例回答**：

1. **使用专门的 Secret Manager（如 AWS Secrets Manager）存储私钥**。
2. **避免在 CI/CD 日志中打印密钥**：
   ```yaml
   env:
     SSH_KEY: ${{ secrets.SSH_KEY }}
   ```
3. **CI/CD 服务器上禁用私钥导出**：
   ```sh
   chmod 400 ~/.ssh/id_rsa
   ```

---

### **9. 如何防止 CI/CD 服务器本身被攻击？**

✅ **考察点**：CI/CD 服务器安全加固。

✅ **示例回答**：

1. **限制 CI/CD 服务器访问权限**：
   ```sh
   iptables -A INPUT -s 192.168.1.0/24 -p tcp --dport 22 -j ACCEPT
   ```
2. **定期更新 CI/CD 工具（如 GitLab Runner、Jenkins）**，防止漏洞攻击。
3. **监控 CI/CD 服务器的异常行为**（如 `fail2ban` 防止暴力破解）。

---

### **10. 如何在 CI/CD 中确保部署包未被篡改？**

✅ **考察点**：构建产物校验、Hash 验证。

✅ **示例回答**：

1. **构建前后 Hash 校验**：
   ```sh
   sha256sum build.tar.gz > checksum.txt
   ```
2. **签署构建产物**：
   ```sh
   gpg --sign --armor -o build.sig build.tar.gz
   ```
3. **发布时校验签名**：
   ```sh
   gpg --verify build.sig build.tar.gz
   ```

---
