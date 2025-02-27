import { useState, useTransition } from 'react';
import './styles.css';

function UseTransitionDemo() {
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState('');
  const [list, setList] = useState([]);

  const LIST_SIZE = 200000;

  function handleChange(e) {
    setInput(e.target.value);

    startTransition(() => {
      const newList = [];
      for (let i = 0; i < LIST_SIZE; i++) {
        newList.push(`${e.target.value} 项目 ${i + 1}`);
      }
      setList(newList);
    });
  }

  return (
    <div className="container">
      
      <h1>useTransition 演示</h1>
      <p>
        此演示展示了如何使用 <code>useTransition</code> 在进行昂贵的状态更新时保持 UI 的响应性。
      </p>

      <div className="input-container">
        <input
          type="text"
          value={input}
          onChange={handleChange}
          placeholder="请输入..."
        />
      </div>

      <div className="status">
        {isPending ? (
          <div className="pending-indicator">加载中...</div>
        ) : (
          <div className="ready-indicator">就绪</div>
        )}
      </div>

      <div className="list-container">
        <h2>包含 {LIST_SIZE} 个项目的列表：</h2>
        <ul>
          {list.slice(0, 100).map((item, index) => (
            <li key={index}>{item}</li>
          ))}
          {list.length > 100 && <li>...以及其他 {list.length - 100} 个项目</li>}
        </ul>
      </div>

      <div className="explanation">
        <h3>useTransition 如何工作：</h3>
        <p>
          <code>useTransition</code> 允许您将某些状态更新标记为非紧急，
          让 React 优先处理更紧急的更新，如输入字段。
        </p>
        <p>
          在此示例中，更新输入字段是即时的，而昂贵的列表生成被标记为过渡，
          保持了 UI 的响应性。
        </p>
        <p>
          <code>isPending</code> 布尔值允许您在过渡进行时显示加载指示器。
        </p>
      </div>

      <button
        onClick={() => window.history.back()}
        className="back-button"
      >
        返回首页
      </button>
    </div>
  );
}

export default UseTransitionDemo;
