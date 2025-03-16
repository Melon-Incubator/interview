整体介绍
我叫 XXX，目前 X 年前端开发经验。最近一家公司是杭州涂鸦，涂鸦是一家做 IOT 的公司，21 年在港股上市。在公司的跨端架构组担任资深前端开发。在职期间我也考试并通过了软考高级项目管理师，申请了并通过了杭州 E 类人才，在项目管理方面有一些经验。作为架构组，需要为各个业务线的开发、外包和外部开发者提供最底层能力的支持。涂鸦原有技术栈为 RN 技术栈，像 RN 技术栈有一些短板，比如学习成本高、更新需要依赖 App 发版、生态不够丰富、与此同时我们还有很多微信小程序的需求， 基于这些原因，我们从 0-1 自研了一套完整的小程序体系。他可以在涂鸦系的 APP 或者在任意 OEM 的 APP 甚至自定义的 App 中运行。接下来我介绍一下我的主要项目，项目从公司小程序架构的演进总共可以分为 3 个架构项目+一个业务支持项目。

第一个是小程序体系搭建。我们从 0 到 1 对标微信完成了完整的小程序体系。我们也做了一些创新的设计。小程序的语法层面可以使用小程序原生语法开发或者 React 开发小程序。容器层面，因为小程序运行在 App 层，客户端提供了小程序容器 SDK 运行小程序。在此基础上我们提供了小程序开发者平台和开发者工具进行小程序调试开发和维护。
在这其中我主要负责基础库、开发者平台和后台的开发。基础库相当于一个小程序的核心依赖，它包含了开发过程中常用的各种功能和接口和组件。开发者不需要从零开始实现常见的功能，如网络请求、界面渲染、数据存储等，而是可以直接使用基础库提供的 API 和组件。基础库提供了小程序的核心能力。开发者平台和后台主要使用 react+antd 开发。开发者平台有调用 AI 能力实现 AI 翻译等功能。目前公司 95%的业务均依托小程序基建完成，经统计业务线研发效率提升 30%，目前已通过直播、官网、开发者群、公众号等多种途径对外宣发，目前外部开发者数量 1000+。

基础库：

1. exparser：是小程序的核心解析器， 管理应用、页面和组件的生命周期。一个标准的小程序文件包含 xml，js 和 config 等，它提供类似微信小程序的 App()、Page()、Component() 的接口，实现了 页面注册、组件管理、页面实例化 等核心功能，并（通过 globalThis） 绑定全局 API，解析业务 js 代码。"
2. amdEngine：因为小程序基础库和业务代码是分属于两个模块，基础库需要载入解析构建的业务小程序包。JS 对异步加载模块化主要有 AMD 和 CMD 两种规范，由于小程序 js 加载不需要按需和延迟加载，因此我们参照 requirejs 实现了小程序的 AMD 加载器，我们称为 amd 引擎。
   引擎主要提供了两个方法，define 和 require。业务包构建产物主要会有两个 js，一个是 xml 编译后的产物，是一颗用来描述模板的多叉树，比如这个树里有 type view， props， children。 一个是 service，即小程序 js 中描述的信息 Page component 的逻辑 比如在某个生命周期发起网络请求，处理点击事件等，会通过 define 方法加载。当生命周期执行时会使用引擎中的 require 方法加载并执行。
   AMD：
   依赖关系是 显式 的，模块内部需要通过参数声明所有依赖。
   模块的依赖会在模块定义之前被加载，确保模块在定义时能够正确引用依赖项。
   CMD：
   依赖关系是 隐式 的，模块内部通过 require 来动态加载依赖，而不是在模块定义时就列出。
   依赖会在执行模块时才进行加载，因此 require 是延迟执行的。他的特点是按需和延迟加载。那不满足我们小程序的使用场景。

> 什么是 amd

    AMD 是一种 JavaScript 模块化规范，用于在浏览器环境中 异步加载模块，提高页面性能。它最主要的实现是 RequireJS。
    特点
    异步加载：不会阻塞页面加载，提高性能。
    依赖前置：模块在执行前必须先声明依赖，提前加载所需模块。
    浏览器友好：主要用于浏览器环境，与 CommonJS 不同（CommonJS 主要用于 Node.js）。
    RequireJS 实现：AMD 规范主要由 RequireJS 作为标准实现。

第一个参数：依赖的模块数组（['moduleA', 'moduleB']）。
第二个参数：回调函数，接收依赖的模块并返回一个对象。
define(['moduleA', 'moduleB'], function(moduleA, moduleB) {
return {
doSomething: function() {
moduleA.action();
moduleB.action();
}
};
});

require 用于在运行时加载模块：
require(['moduleA', 'moduleB'], function(moduleA, moduleB) {
moduleA.action();
moduleB.action();
});

2. VNode、VDom、VComponent：处理 diff 和 patch 逻辑，确保高效的视图更新。目前 diff 算法主要参考的是 react 的简单 diff 算法。后续可以考虑迁移 vue3 的 diff 算法。小程序 tyml 中编写的模板经过编译后会变成描述模板的节点树，最后通过 amd 引擎加载，最终生成 VNode， 当数据发生变化时，VNode 会进行 Diff，视图层会根据 Diff 算法的结果，对真实 DOM 进行的具体更新操作。这些操作包括添加、删除或修改 DOM 元素。

> diff 算法
> 如果要对两棵树进行完全比较的话，非常复杂，React 对 diff 算法进行优化，将时间复杂度降低到 On，
> 同级比较：仅对比同一层级的节点，跨层级的移动会触发重建。
> 类型不同则重建：若节点类型不同（如 div 变为 span），则销毁旧树并创建新树。
> 如果是一个列表的话，我们会先通过 key 值进行比对，如果 key 相同则直接复用。并且 key 需要固定且唯一。

Key 标识稳定元素：通过 key 标识子元素，减少不必要的节点重建。
多节点 Diff
两轮遍历：
第一轮遍历：逐个比对新旧子节点：
若 key 和 type 匹配，继续比对下一个节点。
若 key 不同或 type 不同，终止遍历，进入第二轮。
第二轮遍历：处理未匹配的节点：
新增节点：遍历剩余新节点，标记为插入。
删除节点：遍历剩余旧节点，标记为删除。
移动节点：通过 key 和 最后一个可复用的节点在 oldFiber 中的位置索引 （lastPlacedIndex） 判断节点是否需要移动。
lastPlacedIndex 记录最后一个可复用节点在旧树中的位置。
lastPlacedIndex 初始为 0，每遍历一个可复用的节点，若旧节点位置索引 < lastPlacedIndex，标记为右移。如果 oldIndex >= lastPlacedIndex，则 lastPlacedIndex = oldIndex；
Vue2： 双端 diff
Vue3：静态提升（Static Hoisting）是一项编译时优化技术，旨在提高渲染性能。在模板编译阶段，Vue 3 会对模板进行静态分析，将不包含响应式数据的静态节点提取并提升为常量。这些静态节点在渲染过程中不会发生变化，因此可以在初始渲染时创建一次，并在后续渲染中重复使用，避免每次渲染都重新创建，减少内存开销和不必要的计算。

通过静态提升，Vue 3 的 diff 算法可以跳过对静态节点的比较，专注于处理动态内容的更新，从而显著提高渲染性能。这项优化在处理大量静态内容时尤为有效，能够减少不必要的 DOM 操作，提升应用的整体性能。

4. viewJS、serviceJS：在 app 中小程序视图层是运行在 webview 上，逻辑层 iOS 运行在 JSCore， 安卓运行在 V8 引擎上。在前端开发调试包括 IDE 中，我们是通过内嵌两个 iframe，通过 postMessage 实现视图与逻辑层的通信，并触发生命周期，来模拟小程序实际运行情况。
5. 内置基础组件：基于 Web Components 构建小程序的基础组件框架，提升组件化复用性。使用 Web Components 后性能提升 30%。
   > 测试 @web/test-runner
6. 异层组件与 RJS：提供跨层级组件和高效的远程 JavaScript 通信方案。

> ESbuild VS webpack
> esbuild 就没办法启动一个前端项目，修改代码 HMR。esbuild 适合打包库，像基础库、ark 包这种我们都用 esbuild 打，像前端工程，一般就用 vite 或者 webpack 了。
> Esbuild 插件
> esbuild 本身是一个文件处理工具，通过钩子增加了插件，让 esbuild 可以自定义处理文件。而 webpack 要想做这件事是通过 loader 来做。像我们项目中有很多插件，比如需要加载处理 rjs，构建注入一些初始化的代码和一些运行时的代码以及一些错误捕捉上报，比如文件找不到，以及 js 执行错误捕捉等。
> 定义插件对象：插件对象至少需要包含 name 和 setup 两个属性。

```js
module.exports = {
  name: "my-plugin", // 插件的名称
  setup(build) {
    // 在此注册插件钩子
  },
};
```

build 上有两个函数，一个负责模块解析（onResolve），一个负责模块加载（onLoad）

> Webpack 构建流程
> Webpack 的主要核心概念
> Entry：应用程序的入口，Webpack 从这个文件开始构建依赖图。
> Output：指定打包后的输出文件路径及文件名。
> Module：Webpack 处理的每个文件（包括 JavaScript、CSS、图片等）。
> Loader：用于转换非 JavaScript 文件，例如把 SCSS 转换为 CSS，或者将 Typd'reScript 转换为 JavaScript。
> Plugin：插件，用于在构建过程中执行额外的任务，例如生成 HTML 文件、代码压缩等。

小程序体系搭建完成后考虑到公司开发者原先均有 RN 开发经验属于 react 技术栈，小程序原生语法也有诸多缺陷，于是我们决定自研一套跨端框架来满足需求，我们给他起名 Ray
我们参考了市面上常见的 react 技术栈的跨端框架。市面上常见的跨端框架有两种方案，一种是编译时，一种是运行时，编译时：基于源码通过 ast 分析、代码转化，生成针对不同平台的代码。比如阿里的 Rax 和 taro 1,2。运行时：在代码执行阶段，通过统一的运行时库，适配不同平台的 API 和行为，确保代码在不同环境下正常运行。考虑到编译时对 react 特性会有受限，且希望复用原有 RN 生态，最终我们采用运行时的技术方案，对阿里开源的跨端框架进行了二次开发，实现了跨涂鸦小程序、web、和微信小程序。需要额外说明一下的是，ray 跨端到 web 端，使用的是 webcomponents 的组件渲染，极大程度的保证了小程序端和 web 端的统一性。

> 编译时方案和运行时方案比较
> (1) 编译时：
> 静态分析：静态编译方案是基于源码进行编译。 js 和 jsx 是分开打包，会将 jsx 编译成小程序 wxml 的静态模板，js 编译成小程序的 js。会需要通过 ast 进行分析转换。所以 react 的语法需要跨端框架这边支持才可以使用。那有人会问了，如果三方包使用了，没有源码了怎么办？首先要看三方包是什么包。如果是小程序组件库，没关系可以直接使用，他会通过小程序的 usingcomponents 引入使用。如果是 lodash 这样的 js 库，也可以直接使用，因为只是劫持 js 代码。如果是状态管理库怎么办？ 跨端框架这边会拦截 react 的 setstate，将状态管理变更后的数据调用小程序的 setdata，最后利用静态模板实现视图更新。
> (2) 运行时：react 设计是跨平台的，运行时方案就基于 react-reconciler react 协调器。react 的核心模块包括协调器、和渲染器。基于不同的渲染器如 react-dom 可以将 react 渲染在浏览器上，React Native 可以将 react 渲染在原生视图，那基于运行时的跨端方案其实就是基于协调器实现了一个小程序的渲染器，可以实现在小程序上渲染。在执行的过程中 JSX 会被编译转换成 React.createElement 函数的调用，其返回值就是 VDOM 节点的描述对象。，reactVdom 树进行转换赋值给小程序 data，然后小程序的 data 渲染成页面。那如何渲染成页面的？首先 ray 会将所有的小程序原生组件都用 template 包装成动态组件。放在一个 ray_base 文件夹下。然后 ray 会遍历这棵 data 树，依据 data 树上的 tag，props，children 等相关属性，找到对应的动态组件，利用动态组件进行组装并渲染。如果比如视图触发了点击事件，会触发 react 的 setState，通过 react-reconciler 生成一颗新的 Vdom 树，然后再由 ray 转换成渲染树，然后执行小程序的 setData。最后触发更新。
> 转小程序的核心就是解决如何将一个 json 树转换成 view。
> 优缺点：
> 编译时：语法要求有限制，ast 解析有限制。小程序包体积小。
> 运行时：所有的功能都能使用到，小程序包体积比较大，因为包含很多模板。（需要将所有的小程序组件包成动态模板）

> React 新老架构对比
> React 15：

- Reconciler（协调器）—— 负责找出变化的组件
  在 React 中可以通过 this.setState、this.forceUpdate、ReactDOM.render 等 API 触发更新。
  每当有更新发生时，Reconciler 会做如下工作：

1. 调用函数组件、或 class 组件的 render 方法，将返回的 JSX 转化为虚拟 DOM
2. 将虚拟 DOM 和上次更新时的虚拟 DOM 对比
3. 通过对比找出本次更新中变化的虚拟 DOM
4. 通知 Renderer 将变化的虚拟 DOM 渲染到页面上

- Renderer（渲染器）—— 负责将变化的组件渲染到页面上
  由于 React 支持跨平台，所以不同平台有不同的 Renderer。我们前端最熟悉的是负责在浏览器环境渲染的 Renderer —— ReactDOM。Ray 其实也是一种渲染器。
  React15 中，是使用递归来遍历更新子组件，那这时如果层级过深就可能出现卡顿。而且更新是同步执行的。不可中断。
  React16：
  新增了- Scheduler（调度器）—— 调度任务的优先级，高优任务优先进入 Reconciler 那实现这样的功能就需要一种机制，当浏览器有剩余时间时通知我们，从而完成任务调度。那部分浏览器已经实现了这个功能。考虑到一些兼容性原因和不稳定因素，react 自己实现了这套调度器的概念，并为各种任务设置了优先级。
  那 Fiber 是 React 16 新增的一种状态更新机制，是对原有的 Reconciler 架构的优化。之前 React15 的 Reconciler 采用递归的方式执行，数据保存在递归调用栈中，所以被称为 stack Reconciler。React16 的 Reconciler 基于 Fiber 节点实现，被称为 Fiber Reconciler。React16 中 Fiber 更新 DoM 时还使用了双缓存树的概念，他会在内存中先绘制一份 dom 树绘制完毕后直接替换上一帧的，由于省去了两帧替换间的计算时间，不会出现从白屏到出现画面的闪烁情况。

> 管理 500+ API、文档生成与翻译

1. 目前 ty.\*的 API 是通过插件来提供的，每个插件有一个用于描述方法与事件的 DSL 文件。可以通过 DSL 文件生成
   Android、iOS 的代码，同时也能生成一份 Markdown 文档。
2. 使用 art-template 实现依据代码自动生成文档。调用翻译 api 进行机翻，调用相关 AI 接口进行文档示例代码输出。
3. TODO：生成 bin 文件集成进 CI CD。

有了前两个项目作为基础，我们小程序正式对外推广使用了。不仅可以覆盖有微信小程序和 react 开发经验的人群 还有非开发人员都想尝试使用我们的小程序，为了覆盖那一部分非开发人员，我们启动了第三个项目 studio。这是一个低代码平台，通过实现简单的拖拽配置即可构建生成小程序，不需要开发。在这个低代码平台中我们还融合了 AI 能力，比如通过一些描述让 AI 帮助你生成一个小程序，或者通过对话让 AI 帮你实现某一些组件联动的逻辑等。目前这个项目也已经上线，线上累计约有 5000 个生成的小程序。

> 架构
> · Workbench 工作台：

1. Workbench：基于 React + zustand 搭建的 Web 应用，管理搭建期间生成的所有数据，如搭建树、主题配置、面板规
   则、样式联动等。
2. AI 融合：基于一些描述信息可通过 AI 一键生成不同风格的面板。通过 AI 能力进行主题、规则、样式联动的配置。多语言
   一键翻译等。
3. 实时预览：通过 Websocket 建立 MQTT 连接进行端的实时预览调试。
   · Sandbox：
4. 小程序渲染器：使用小程序渲染引擎在 web 端进行渲染。
5. 支持多种布局方式：支持快速布局、自定义布局和 AI 布局模式，并支持相互切换。
   · 物料：
6. CLI：提供物料模板生成 CLI。
7. contextContainer：提供物料组件在 Sandbox 中渲染处理副作用（如拖拽）的垫片。
8. 提供了物料平台用来维护和管理相关物料组件。
   · 打包器：
9. JSON2Ray：模板+动态代码生成 Ray 项目然后构建成小程序

> 构建流程

1. 获取 studio 项目打包时的 json 数据。
2. 模板+动态代码生成 ray 项目
   1. 模版指的是 ray 项目中那些不变动的
      1. 入口文件 app、composeLayout（SDM 及设备初始化相关）
      2. 全局 CSS（自定义主题变量、网格布局 class 定义）
      3. devices（SDM 需要的固定目录、schema 等文件）
      4. i18n
   2. 动态代码
      1. 循环 json 中 pages 写入页面数据
         1. renderJson → React.createElement
         2. 遍历 tree children 时，收集使用的组件与依赖
            1. 在页面中导入
            2. 在 package.json 中添加依赖
         3. 获取是否使用设备名称作为 navigationBarText
            1. 若使用则动态添加代码 setNavigationBarTitle 使用设备名称
      2. 根据是否跟随 APP 主题写入 app.css
      3. 动态写入 global.config.json
         1. 用到的功能页注入
         2. 用到的原生路由注入
         3. 注入配置的 theme.json
      4. 写入多语言数据在 i18n 目录。

.> 数据定义

```ts
export interface TPageObject {
  id: string;
  displayName: string;
  isHomePage?: boolean; // 是否为首页，首页无法删除
  layoutType?: TLayoutType;
  renderData: TreeChild;
  pageConfig: {
    navigationBarTitleText: string;
    isUseDeviceName: boolean;
  };
  themeConfig: {
    light: TPageThemeConfig;
    dark: TPageThemeConfig;
  };
  pageType?: number;
}

type TreeChild = {
  tag: string;
  props: Record<string, any> & {
    instanceId: string;
    actions?: any[];
    expressions?: any[];
    dpCodes?: any[];
  };
  packageVersion?: string;
  packageName?: string;
  children: Array<TreeChild>;
  instanceName: string;
  isGroup?: boolean;
  wrapper?: string;
  wrapperStyle?: {
    position: string;
    zIndex: number;
    top: string;
    left: string;
    rpxTop: string;
    rpxLeft: string;
  };
  isGroup?: boolean;
  scrollTop?: number;
  scrollLeft?: number;
  pageType: 0 | 1; // 0: 绝对定位， 1: 网格布局
};
```

除了在做基建，我也有做思考如何为业务提供更多的帮助。
从文档示例上，官方我们为开发者提供了完整的官方文档、教程、开发者论坛，开发者群和开源的示例代码仓库，极大程度的降低开发者上手的门槛。
从社区生态接入上，从一阶段的 fork 微信物料到仅需添加一行配置即可直接接入微信生态。
从性能优化上，我结合客户端提供了性能分析工具，提供了原创的 RJS、异层组件等方案。

> 小程序性能优化
> 框架层面：
> 运行时优化：RJS、RJS 通信、SJS、组件懒加载、diff 优化、异层组件、性能分析工具。
> 编译时优化：webpack 改为 Esbuild。
> 业务代码层面：包大小优化、渐进式加载如 lazy-load、缓存策略、防抖节流减少数据传输、销毁持久化内存，如 onHide 时应清除定时器，onShow 在开启。长列表
> 代码规范层面：通过文档规范、最佳实践、答疑群指引高质量代码、官方提供相关性能指标参考。

> 前端性能优化
> 前端性能优化可以从多个角度入手：
> 资源优化：使用 CDN 加速资源加载；
> 图片懒加载、图片压缩、使用 WebP 格式；
> 代码压缩、混淆、gzip 传输。
> 代码拆分：利用 webpack、Rollup 等工具进行代码分割，实现按需加载。
> 缓存策略：合理设置 HTTP 缓存（Cache-Control、ETag）；
> 使用 Service Worker 实现离线缓存。减少重绘和重排：
> 批量操作 DOM，尽量减少 DOM 操作次数；使用 CSS3 动画代替 JavaScript 动画，避免频繁触发布局计算。
> 异步处理：利用 Web Worker 将计算密集型任务放在后台线程中执行；
> 使用节流（throttle）和防抖（debounce）技术控制频繁触发的事件。

> 单线程模型
> 为了进一步提升页面流畅度、降低内存消耗和启动开销，微信小程序团队提出了 Skyline 架构，其核心思想在于：将原来在 WebView 中同时承担 JS 执行与页面渲染的任务拆分开来。利用专门的渲染线程来处理布局、合成（Composite）和绘制（Paint）等任务，而业务逻辑则在独立的逻辑线程（AppService）中运行，从而避免互相阻塞。降低跨线程通信开销
> Skyline 架构的优势与意义
> 界面不卡顿：通过将渲染任务从业务逻辑中分离出来，界面渲染不易被 JS 逻辑阻塞，从而显著提升流畅度。
> 内存与启动优化：无需为每个页面独立创建 JS 引擎实例，多页面可以共享资源，降低内存占用，并加快页面加载速度。
> 减少通信延时：下沉部分组件和样式逻辑到原生层，避免频繁使用 JSBridge 进行数据交换，进一步降低通信带来的延时。
> 原生体验：Skyline 的设计让小程序在体验上更接近原生 App，既拥有丰富的 Web 技术优势，又避免了传统 WebView 模型的种种瓶颈

> react hooks 实现原理
> 闭包机制
> 闭包是指一个函数能够访问并操作其外部函数作用域中的变量，即使外部函数已经执行完毕

```js
function createCounter() {
  let count = 0; // `count` 是一个局部变量
  return function () {
    count += 1;
    return count;
  };
}

const counter = createCounter();
console.log(counter()); // 输出：1
```

createCounter 函数返回了一个内部函数，该内部函数可以访问并修改 createCounter 中的局部变量 count。 即使 createCounter 函数已经执行完毕，返回的内部函数仍然可以访问并操作 count，这就是闭包的特性。
