# React 核心概念 - 面试指南

## 1. React 的设计思想

### 1.1 核心理念

React 的核心理念包括：

1. **声明式编程**

```jsx
// 问题：声明式和命令式编程的区别？
// 答：声明式关注"做什么"，命令式关注"怎么做"

// 声明式（React方式）
function Welcome() {
  return <h1>Hello, React</h1>;
}

// 命令式（传统方式）
function Welcome() {
  const element = document.createElement("h1");
  element.innerHTML = "Hello, React";
  return element;
}
```

2. **组件化**

```jsx
// 问题：React 组件化的优势是什么？
// 答：复用性、可维护性、关注点分离

// 可复用的组件示例
function Button({ type, onClick, children }) {
  return (
    <button className={`btn-${type}`} onClick={onClick}>
      {children}
    </button>
  );
}

// 组件组合
function App() {
  return (
    <div>
      <Button type="primary" onClick={() => {}}>
        提交
      </Button>
      <Button type="danger" onClick={() => {}}>
        删除
      </Button>
    </div>
  );
}
```

3. **单向数据流**

```jsx
// 问题：为什么 React 强调单向数据流？
// 答：可预测性、易于调试、数据流向清晰

function Parent() {
  const [count, setCount] = useState(0);

  return <Child count={count} onIncrement={() => setCount(count + 1)} />;
}
```

### 1.2 Virtual DOM

```jsx
// 问题：Virtual DOM 的工作原理是什么？
// 答：
// 1. 生成虚拟 DOM 树
// 2. diff 算法比较差异
// 3. 批量更新真实 DOM

function Example() {
  const [list, setList] = useState(["A", "B"]);

  return (
    <ul>
      {list.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

// Virtual DOM 的优势：
// 1. 跨平台
// 2. 批量更新
// 3. 性能优化
```

## 2. React 组件化开发

### 2.1 组件类型与使用

> 面试题：React 中的组件类型有哪些？如何选择合适的组件类型？

```jsx
// 🤔 问题：函数组件和类组件的区别是什么？各自的优缺点？
// ✅ 答案：
// 1. 函数组件优势：
//    - 代码简洁，易于理解和测试
//    - 更好的性能优化（无实例化开销）
//    - 支持 Hooks，更灵活的状态管理
//    - 更好的代码复用和逻辑提取
// 2. 类组件优势：
//    - 完整的生命周期
//    - 内部状态管理
//    - 适合复杂组件

// 1. 函数组件（推荐）
function UserProfile({ user }) {
  const [isEditing, setIsEditing] = useState(false);

  // 使用 Hooks 处理副作用
  useEffect(() => {
    document.title = `${user.name}'s Profile`;
    return () => {
      document.title = "React App";
    };
  }, [user.name]);

  return (
    <div>
      <h2>{user.name}</h2>
      {isEditing ? (
        <EditForm user={user} />
      ) : (
        <button onClick={() => setIsEditing(true)}>编辑资料</button>
      )}
    </div>
  );
}

// 2. 类组件
class UserList extends React.Component {
  state = {
    users: [],
    loading: true,
  };

  componentDidMount() {
    this.fetchUsers();
  }

  fetchUsers = async () => {
    const users = await api.getUsers();
    this.setState({ users, loading: false });
  };

  render() {
    const { users, loading } = this.state;
    if (loading) return <Loading />;

    return (
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    );
  }
}
```

### 2.2 组件通信方式

> 面试题：React 组件间如何进行通信？各种通信方式的优缺点是什么？

```jsx
// 🤔 问题：React 中有哪些组件通信方式？如何选择？
// ✅ 答案：
// 1. Props：父子组件通信的基本方式
// 2. Context：跨层级组件通信
// 3. 状态管理库：复杂应用的状态管理
// 4. 发布订阅：组件间的事件通信
// 5. Ref：直接操作子组件

// 1. Props 通信
function Parent() {
  const [count, setCount] = useState(0);

  return <Child count={count} onIncrement={() => setCount(count + 1)} />;
}

// 2. Context 通信
const ThemeContext = React.createContext("light");

function App() {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Header />
      <MainContent />
      <Footer />
    </ThemeContext.Provider>
  );
}

function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);
  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      切换主题
    </button>
  );
}

// 3. 状态管理（Redux 示例）
const Counter = () => {
  const count = useSelector((state) => state.count);
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch({ type: "INCREMENT" })}>
      Count: {count}
    </button>
  );
};
```

### 2.3 组件设计模式

> 面试题：React 中常用的组件设计模式有哪些？

```jsx
// 🤔 问题：如何设计可复用的组件？常用的设计模式有哪些？
// ✅ 答案：
// 1. 复合组件模式
// 2. 高阶组件（HOC）
// 3. Render Props
// 4. 自定义 Hooks

// 1. 复合组件模式
function Select({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="select">
      <Select.Trigger onClick={() => setIsOpen(!isOpen)} />
      {isOpen && <Select.Options>{children}</Select.Options>}
    </div>
  );
}

Select.Trigger = function Trigger({ onClick }) {
  return <button onClick={onClick}>选择</button>;
};

Select.Options = function Options({ children }) {
  return <div className="options">{children}</div>;
};

// 2. 高阶组件（HOC）
function withLoading(WrappedComponent) {
  return function WithLoadingComponent({ isLoading, ...props }) {
    if (isLoading) return <Loading />;
    return <WrappedComponent {...props} />;
  };
}

// 3. Render Props
class Mouse extends React.Component {
  state = { x: 0, y: 0 };

  handleMouseMove = (event) => {
    this.setState({
      x: event.clientX,
      y: event.clientY,
    });
  };

  render() {
    return (
      <div onMouseMove={this.handleMouseMove}>
        {this.props.children(this.state)}
      </div>
    );
  }
}

// 4. 自定义 Hooks
function useWindowSize() {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}
```

### 2.4 最佳实践

1. **组件职责单一**
2. **保持组件纯函数特性**
3. **合理使用 Props 类型检查**
4. **避免过度设计**
5. **注意性能优化**

## 3. React 性能优化

### 3.1 常用优化手段

```jsx
// 问题：React 常见的性能优化方式有哪些？

// 1. React.memo 避免不必要的渲染
const MemoComponent = React.memo(function MyComponent(props) {
  return <div>{props.value}</div>;
});

// 2. useMemo 缓存计算结果
function Example({ data }) {
  const processedData = useMemo(() => {
    return expensiveOperation(data);
  }, [data]);
}

// 3. useCallback 缓存函数
function Parent() {
  const handleClick = useCallback(() => {
    console.log("clicked");
  }, []); // 依赖为空数组，函数永远不变
}

// 4. 虚拟列表优化长列表
function VirtualList({ items }) {
  return (
    <div style={{ height: "400px", overflow: "auto" }}>
      {/* 只渲染可视区域的内容 */}
    </div>
  );
}
```

### 3.2 常见问题和解决方案

```jsx
// 问题：如何处理 React 中的常见性能问题？

// 1. 避免内联函数
// ❌ 不好的做法
<button onClick={() => handleClick()}>Click</button>

// ✅ 好的做法
<button onClick={handleClick}>Click</button>

// 2. 大量数据渲染
function BigList({ items }) {
  // 使用 windowing 或分页
  return (
    <div>
      {items.slice(0, 10).map(item => (
        <ListItem key={item.id} data={item} />
      ))}
    </div>
  );
}

// 3. 状态管理优化
function OptimizedComponent() {
  // 使用 useReducer 替代多个 useState
  const [state, dispatch] = useReducer(reducer, initialState);
}
```

## 4. 面试重点

1. **React 的工作原理**

- Virtual DOM 的实现
- Diff 算法的原理
- Fiber 架构

2. **状态管理**

- setState 的原理
- Hooks 的实现
- Redux 的工作流程

3. **生命周期**

- 新旧生命周期的区别
- useEffect 的执行时机
- 常见问题处理

4. **性能优化**

- 渲染优化
- 数据处理
- 代码分割
