---
layout: home
hero:
  name: "{ FE Interview }"
  text: "大前端面试整理"
  tagline: 大前端面试整理
  actions:
    - theme: alt
      text: GitHub
      link: https://github.com/melon-incubator

features:
  - icon: 🚀
    title: 国际化前端开发
    details: 掌握全球市场的 Web 开发技术，提升 React、Vue 的国际化能力。
  - icon: ⚙️
    title: 后端技术孵化
    details: 构建可扩展的后端系统，支持全球用户的高效访问。
  - icon: 🤖
    title: 人工智能创新
    details: 探索 AI 在全球市场的应用，从机器学习到大语言模型。
  - icon: 🌱
    title: 项目孵化
    details: 孵化创新项目，助力产品全球化。
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #00ff9d, #00b8ff);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #00ff9d60 30%, #00b8ff60 70%);
  --vp-home-hero-image-filter: blur(72px);
  --vp-c-brand: #00ff9d;
  --vp-c-brand-light: #00b8ff;
  --vp-button-brand-bg: #00ff9d;
  --vp-button-brand-hover-bg: #00b8ff;
}

.VPHero .name {
  font-family: 'Courier New', monospace;
  letter-spacing: -2px;
  font-weight: 800;
}

.VPHero .text {
  font-family: 'Courier New', monospace;
  letter-spacing: -1px;
  font-weight: 600;
}

.VPFeature .icon {
  background: linear-gradient(120deg, #00ff9d20, #00b8ff20);
  border-radius: 6px;
  padding: 10px;
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(56px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(72px);
  }
}
</style>
