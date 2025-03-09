import { useState, useDeferredValue, useMemo } from 'react';
import './styles.css';

function UseDeferredValueDemo() {
  const [input, setInput] = useState('');
  const deferredInput = useDeferredValue(input);
  
  const LIST_SIZE = 200000;
  
  // 使用 useMemo 缓存列表计算结果，避免不必要的重新计算
  const list = useMemo(() => {
    console.log(`生成列表，使用延迟值: "${deferredInput}"`);
    const newList = [];
    for (let i = 0; i < LIST_SIZE; i++) { 
      newList.push(`${deferredInput} 项目 ${i + 1}`);
    }
    return newList;
  }, [deferredInput]);

  // 检测输入值和延迟值是否不同，用于显示状态
  const isStale = input !== deferredInput;
  
  function handleChange(e) {
    setInput(e.target.value);
  }

  return (
    <div className="container">
      <h1>useDeferredValue 演示</h1>
      <p>
        此演示展示了如何使用 <code>useDeferredValue</code> 在处理大量数据时保持 UI 的响应性。
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
        {isStale ? (
          <div className="pending-indicator">更新中...</div>
        ) : (
          <div className="ready-indicator">就绪</div>
        )}
      </div>
      
      <div className="comparison">
        <div className="value-display">
          <strong>当前输入值:</strong> "{input}"
        </div>
        <div className="value-display">
          <strong>延迟值:</strong> "{deferredInput}"
        </div>
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
        <h3>useDeferredValue 如何工作：</h3>
        <p>
          <code>useDeferredValue</code> 创建一个延迟版本的值，React 会在渲染完更高优先级的更新后再处理这个延迟值。
        </p>
        <p>
          在此示例中，当您在输入框中输入时，输入值会立即更新，而基于该值生成的大型列表会使用延迟值，
          这样可以保持输入的响应性。
        </p>
        <p>
          与 <code>useTransition</code> 不同，<code>useDeferredValue</code> 不需要包装状态更新函数，
          而是直接作用于值本身，更适合处理从 props 或其他组件接收的值。
        </p>
      </div>
      
      <div className="comparison-section">
        <h3>useDeferredValue vs useTransition</h3>
        <table className="comparison-table">
          <thead>
            <tr>
              <th>特性</th>
              <th>useDeferredValue</th>
              <th>useTransition</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>用途</td>
              <td>延迟处理特定值</td>
              <td>标记状态更新为低优先级</td>
            </tr>
            <tr>
              <td>使用方式</td>
              <td>直接包装值</td>
              <td>包装状态更新函数</td>
            </tr>
            <tr>
              <td>适用场景</td>
              <td>处理从 props 或外部接收的值</td>
              <td>控制自己的状态更新</td>
            </tr>
            <tr>
              <td>状态指示</td>
              <td>需要手动比较原值和延迟值</td>
              <td>提供 isPending 状态</td>
            </tr>
          </tbody>
        </table>
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

export default UseDeferredValueDemo;
