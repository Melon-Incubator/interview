# React Hooks 完全指北

## 为什么需要 Hooks?

在 Hooks 出现之前，React 组件主要存在以下问题：

1. **类组件的复杂性**

   - this 绑定问题
   - 生命周期方法难以理解和维护
   - 代码复用困难（需要使用 HOC 或 render props）

2. **逻辑复用的局限性**

   - 难以复用有状态的组件逻辑
   - 容易产生"嵌套地狱"
   - 组件层级过深

3. **代码组织问题**
   - 相关联的逻辑被分散在不同的生命周期方法中
   - 难以进行代码分割和测试

## Hooks 的优势

1. **更好的逻辑复用**

   - 自定义 Hook 可以轻松地在组件间共享状态逻辑
   - 不会产生额外的组件层级

2. **更清晰的代码组织**

   - 相关联的逻辑可以放在一起
   - 代码更容易理解和维护

3. **更简单的状态管理**
   - 告别 this 和类组件的复杂性
   - 使用函数式编程的方式管理状态

## 常用的 Hooks

### 1. useState

用于在函数组件中管理状态：

```jsx
const [state, setState] = useState(initialState);
```

示例：

```jsx
function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>计数：{count}</p>
      <button onClick={() => setCount(count + 1)}>增加</button>
      <button onClick={() => setCount((prev) => prev - 1)}>减少</button>
    </div>
  );
}
```

### 2. useEffect

处理副作用操作，如数据获取、订阅等：

```jsx
useEffect(() => {
  // 执行副作用
  return () => {
    // 清理函数
  };
}, [dependencies]);
```

常见用例：

```jsx
function UserProfile({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/users/${userId}`);
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("获取用户信息失败:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();

    return () => {
      // 清理工作，比如取消请求
    };
  }, [userId]);

  if (loading) return <div>加载中...</div>;
  if (!user) return <div>未找到用户</div>;

  return <div>{user.name}</div>;
}
```

### 3. useContext

用于获取 Context 上下文数据：

```jsx
const ThemeContext = React.createContext("light");

function ThemeButton() {
  const theme = useContext(ThemeContext);
  return <button className={theme}>主题按钮</button>;
}
```

### 4. useReducer

用于复杂状态管理：

```jsx
const initialState = { count: 0 };

function reducer(state, action) {
  switch (action.type) {
    case "increment":
      return { count: state.count + 1 };
    case "decrement":
      return { count: state.count - 1 };
    default:
      throw new Error();
  }
}

function Counter() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      计数: {state.count}
      <button onClick={() => dispatch({ type: "increment" })}>+</button>
      <button onClick={() => dispatch({ type: "decrement" })}>-</button>
    </>
  );
}
```

### 5. useMemo 和 useCallback

用于性能优化：

```jsx
// useMemo 缓存计算结果
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// useCallback 缓存函数
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
```

### 6. useRef

保存可变值和访问 DOM 元素：

```jsx
function TextInputWithFocusButton() {
  const inputEl = useRef(null);

  const onButtonClick = () => {
    inputEl.current.focus();
  };

  return (
    <>
      <input ref={inputEl} type="text" />
      <button onClick={onButtonClick}>聚焦输入框</button>
    </>
  );
}
```

## 自定义 Hook

创建可复用的状态逻辑：

```jsx
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

// 使用自定义 Hook
function App() {
  const size = useWindowSize();
  return (
    <div>
      窗口尺寸: {size.width} x {size.height}
    </div>
  );
}
```

## Hook 使用规则

1. **只在最顶层使用 Hook**

   - 不要在循环、条件或嵌套函数中调用 Hook
   - 确保 Hook 的调用顺序保持一致

2. **只在 React 函数中调用 Hook**
   - 在 React 函数组件中调用 Hook
   - 在自定义 Hook 中调用其他 Hook

## 最佳实践

1. **合理设置依赖项**

   ```jsx
   // 不好的做法
   useEffect(() => {
     // ...
   }, []); // 空依赖数组但使用了外部变量

   // 好的做法
   useEffect(() => {
     // ...
   }, [necessary, dependencies]);
   ```

2. **使用函数式更新**

   ```jsx
   // 不好的做法
   setCount(count + 1);

   // 好的做法
   setCount((prevCount) => prevCount + 1);
   ```

3. **避免过度使用 useMemo 和 useCallback**

   - 只在性能确实存在问题时使用
   - 注意依赖项的变化频率

4. **合理组织 Hook 逻辑**
   - 相关的状态和副作用放在一起
   - 复杂逻辑抽取为自定义 Hook

## 常见问题解决

1. **无限循环问题**

   ```jsx
   // 问题代码
   useEffect(() => {
     setData(fetchData());
   });

   // 解决方案
   useEffect(() => {
     fetchData().then(setData);
   }, []); // 添加适当的依赖项
   ```

2. **状态更新不及时**

   ```jsx
   // 问题代码
   const handleClick = () => {
     setCount(count + 1);
     console.log(count); // 显示旧值
   };

   // 解决方案
   const handleClick = () => {
     setCount((prev) => {
       const newCount = prev + 1;
       console.log(newCount);
       return newCount;
     });
   };
   ```

## 总结

React Hooks 提供了一种更优雅的方式来管理组件状态和副作用。通过合理使用 Hooks，我们可以：

- 编写更简洁、可维护的代码
- 更好地复用组件逻辑
- 避免类组件的复杂性
- 实现更清晰的关注点分离

掌握 Hooks 的使用对于现代 React 开发来说是必不可少的技能。
