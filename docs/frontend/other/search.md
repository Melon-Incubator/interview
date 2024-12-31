# 轻量级全文搜索

---

## **目标设计**

1. **轻量化**：针对中小型文档库，内存占用小，响应速度快。
2. **高性能**：
   - 快速的索引构建和查询速度。
   - 支持前端运行，适合单页应用（SPA）。
3. **易用性**：API 简洁，支持常见的分词和搜索功能。
4. **可扩展性**：支持中文搜索及其他语言扩展。

---

## **核心架构**

全文搜索系统分为两个部分：

1. **索引构建**（构建阶段）：将原始文档转化为高效的倒排索引。
2. **搜索查询**（运行时）：根据关键词快速查找匹配的文档。

---

## **优化方案**

### 1. **索引优化**

- **预生成静态索引文件**：
  - 在构建阶段完成索引构建，将结果存储为压缩的 JSON 文件，减少运行时计算开销。
- **紧凑的数据结构**：

  - 使用字典压缩字段名称和内容，例如将 `title` 替换为 `t`，`content` 替换为 `c`。
  - 用数组存储倒排索引，减少 JSON 的嵌套复杂度。

  示例压缩索引：

  ```json
  {
    "docs": [
      { "id": 1, "t": "Introduction", "c": "Welcome to the guide." },
      { "id": 2, "t": "Setup", "c": "Install the package with npm." }
    ],
    "index": {
      "introduction": [1],
      "welcome": [1],
      "setup": [2],
      "install": [2],
      "package": [2],
      "npm": [2]
    }
  }
  ```

- **倒排索引分块**：
  - 如果文档量大，将索引按文档类型或主题分块存储，只加载当前需要的部分。
- **索引分片与延迟加载**:
  - 按文档类型或时间范围对索引进行分片
  - 实现延迟加载机制，首次只加载核心索引
  - 支持动态加载额外索引分片

```typescript
interface IndexShard {
  startId: number;
  endId: number;
  index: Record<string, number[]>;
}

interface ShardedIndex {
  shards: IndexShard[];
  metadata: {
    totalDocs: number;
    shardSize: number;
  };
}
```

---

### 2. **分词优化**

- **英文分词**：
  - 使用简单的正则表达式分割为单词。
- **中文分词**：
  - 借助轻量化分词工具（如 [TinySegmenter](https://github.com/wanasit/chrono) 或 [nodejieba](https://github.com/yanyiwu/nodejieba)）实现更高精度。
- **停用词过滤**：
  - 构建时过滤掉常见无意义的词（如 "的", "and", "the" 等），减少索引大小。
- **智能分词策略**:

  ```typescript
  interface TokenizerOptions {
    language: "zh" | "en" | "auto";
    useCache?: boolean;
    stopWords?: Set<string>;
  }

  class SmartTokenizer {
    private cache: Map<string, string[]> = new Map();

    tokenize(text: string, options: TokenizerOptions): string[] {
      if (options.useCache) {
        const cached = this.cache.get(text);
        if (cached) return cached;
      }

      let tokens: string[];
      switch (options.language) {
        case "zh":
          tokens = this.chineseTokenize(text);
          break;
        case "en":
          tokens = this.englishTokenize(text);
          break;
        case "auto":
          tokens = this.autoDetectTokenize(text);
          break;
      }

      if (options.stopWords) {
        tokens = tokens.filter((t) => !options.stopWords.has(t));
      }

      if (options.useCache) {
        this.cache.set(text, tokens);
      }

      return tokens;
    }
  }
  ```

---

### 3. **查询优化**

- **快速查找**：
  - 使用倒排索引直接查询包含关键词的文档 ID，避免全文扫描。
- **相关性排序**：
  - 使用简单的评分公式，考虑字段权重、关键词匹配数量和位置：
    \[
    \text{Score} = w_t \cdot \text{titleHits} + w_c \cdot \text{contentHits}
    \]
    其中 \(w_t > w_c\)。
- **结果缓存**：
  - 对常用查询（如热词）缓存结果，避免重复计算。
- **高级搜索特性**:

  ```typescript
  interface SearchOptions {
    fuzzy?: boolean; // 模糊匹配
    boost?: {
      // 字段权重
      title: number;
      content: number;
    };
    highlight?: boolean; // 高亮匹配
    maxResults?: number; // 最大结果数
  }

  interface SearchResult {
    id: number;
    title: string;
    content: string;
    score: number;
    highlights?: {
      title?: string[];
      content?: string[];
    };
  }
  ```

---

### 4. **运行时性能**

- **Web Worker**：
  - 将搜索逻辑放到 Web Worker 中，异步执行避免阻塞主线程。
- **增量加载**：
  - 如果索引文件较大，按需加载分块数据。
- **索引压缩**:
  ```typescript
  class IndexCompressor {
    compress(index: Record<string, number[]>): string {
      // 使用 LZ-string 或其他压缩算法
      return LZString.compress(JSON.stringify(index));
    }

    decompress(compressed: string): Record<string, number[]> {
      return JSON.parse(LZString.decompress(compressed));
    }
  }
  ```

---

## **轻量级实现示例**

以下是一个轻量级全文搜索的实现示例：

### **索引构建**

```typescript
class SearchIndex {
  private index: Record<string, number[]> = {};
  private documents: { id: number; title: string; content: string }[] = [];

  // 添加文档到索引
  addDocument(doc: { id: number; title: string; content: string }) {
    this.documents.push(doc);
    const tokens = this.tokenize(doc.title + " " + doc.content);
    tokens.forEach((token) => {
      if (!this.index[token]) {
        this.index[token] = [];
      }
      if (!this.index[token].includes(doc.id)) {
        this.index[token].push(doc.id);
      }
    });
  }

  // 分词器
  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[\W_]+/g, " ")
      .split(/\s+/);
  }

  // 导出索引
  export() {
    return {
      documents: this.documents,
      index: this.index,
    };
  }
}
```

### **运行时搜索**

```typescript
class SearchEngine {
  private index: Record<string, number[]>;
  private documents: { id: number; title: string; content: string }[];

  constructor(data: { index: Record<string, number[]>; documents: any[] }) {
    this.index = data.index;
    this.documents = data.documents;
  }

  search(query: string): { id: number; title: string; content: string }[] {
    const keywords = this.tokenize(query);
    const docScores: Record<number, number> = {};

    // 统计文档分数
    keywords.forEach((keyword) => {
      const docIds = this.index[keyword] || [];
      docIds.forEach((id) => {
        docScores[id] = (docScores[id] || 0) + 1;
      });
    });

    // 根据分数排序
    return Object.entries(docScores)
      .sort(([, scoreA], [, scoreB]) => scoreB - scoreA)
      .map(([id]) => this.documents.find((doc) => doc.id === parseInt(id))!)
      .filter(Boolean);
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[\W_]+/g, " ")
      .split(/\s+/);
  }
}
```

### **使用示例**

#### 索引构建阶段

```typescript
const index = new SearchIndex();
index.addDocument({
  id: 1,
  title: "Introduction",
  content: "Welcome to the guide.",
});
index.addDocument({
  id: 2,
  title: "Setup",
  content: "Install the package with npm.",
});

const data = index.export();
// 将 data 保存为静态文件
```

#### 运行时搜索阶段

```typescript
const searchEngine = new SearchEngine(data);
const results = searchEngine.search("npm package");
console.log(results);
// 输出匹配的文档
```

---

## **进阶优化**

1. **压缩存储**：
   - 使用 Base64 或其他压缩方式存储索引文件。
2. **分页加载**：
   - 对大索引分段存储，按需加载。
3. **支持模糊匹配**：
   - 实现 Levenshtein 编辑距离算法，支持拼写错误的模糊匹配。
4. **适配多语言**：
   - 提供语言扩展机制，支持英文、中文等多语言文档。

## **新增功能**

### 1. **实时搜索建议**

```typitten
class SearchSuggester {
  private trie: Trie = new Trie();

  buildSuggestions(documents: Document[]) {
    documents.forEach(doc => {
      this.trie.insert(doc.title, doc.id);
      // 为内容中的关键短语建立建议
      this.extractPhrases(doc.content).forEach(phrase =>
        this.trie.insert(phrase, doc.id)
      );
    });
  }

  suggest(prefix: string): string[] {
    return this.trie.search(prefix).slice(0, 5);
  }
}
```

### 2. **搜索分析**

```typescript
class SearchAnalytics {
  private searches: Map<string, number> = new Map();
  private clickthrough: Map<string, Set<number>> = new Map();

  logSearch(query: string) {
    this.searches.set(query, (this.searches.get(query) || 0) + 1);
  }

  logClickthrough(query: string, docId: number) {
    if (!this.clickthrough.has(query)) {
      this.clickthrough.set(query, new Set());
    }
    this.clickthrough.get(query)!.add(docId);
  }

  getPopularSearches(): Array<{ query: string; count: number }> {
    return Array.from(this.searches.entries())
      .map(([query, count]) => ({ query, count }))
      .sort((a, b) => b.count - a.count);
  }
}
```
