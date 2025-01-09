---
layout: home
hero:
  name: "{ Melon FE }"
  text: "大前端面试整理"
  tagline: 技能整理，面向未来编程。
  actions:
    - theme: brand
      text: 开始阅读
      link: /frontend/
    - theme: alt
      text: 项目孵化器
      link: https://melon-incubator-blog.netlify.app/
    - theme: alt
      text: GitHub
      link: https://github.com/Melon-Incubator/interview

features:
  - icon: 💻
    title: 前端基础进阶
    details: 夯实基础知识体系，掌握核心技术要点，提升编程思维与开发技巧。
  - icon: ⚡️
    title: 框架原理
    details: 深入理解主流框架原理，掌握性能优化方案，提升架构设计能力。
  - icon: 🛠️
    title: 工程化实践
    details: 掌握现代前端工程化体系，构建规范化流程，提升团队研发效率。
  - icon: 🌐
    title: 跨端开发
    details: 探索多端解决方案，打通研发链路，实现一次开发多端运行。
---

<style>
:root {
  --vp-home-hero-name-color: transparent;
  --vp-home-hero-name-background: -webkit-linear-gradient(120deg, #ff6b6b, #ffd93d);
  --vp-home-hero-image-background-image: linear-gradient(-45deg, #ff6b6b60 30%, #ffd93d60 70%);
  --vp-home-hero-image-filter: blur(60px);
  --vp-c-brand: #ff6b6b;
  --vp-c-brand-light: #ffd93d;
  --vp-button-brand-bg: #ff6b6b;
  --vp-button-brand-hover-bg: #ffd93d;
}

.VPHero .name {
  font-family: 'Microsoft YaHei', sans-serif;
  letter-spacing: 1px;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
}

.VPHero .text {
  font-family: 'Microsoft YaHei', sans-serif;
  letter-spacing: 0.5px;
  font-weight: 500;
}

.VPFeature .icon {
  background: linear-gradient(120deg, #ff6b6b20, #ffd93d20);
  border-radius: 12px;
  padding: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

@media (min-width: 640px) {
  :root {
    --vp-home-hero-image-filter: blur(48px);
  }
}

@media (min-width: 960px) {
  :root {
    --vp-home-hero-image-filter: blur(60px);
  }
}
</style>
