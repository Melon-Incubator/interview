# MiniSearch 实现原理

MiniSearch 是一个用 TypeScript 实现的轻量级全文搜索库。本文将详细介绍其核心实现原理和关键技术。

## 核心特性

- 高效的全文搜索
- 灵活的分词支持
- 文档相关性排序
- 多语言支持
- 自定义配置选项

## 实现原理

### 1. 数据结构

#### 倒排索引

倒排索引是搜索引擎的核心数据结构,将单词映射到包含该单词的文档列表:

```typescript
interface InvertedIndex {
  [term: string]: {
    [documentId: string]: number; // 词频
  };
}
```

#### 文档存储

用于存储文档元数据:

```typescript
interface DocumentStore {
  [documentId: string]: {
    title: string;
    content: string;
    [key: string]: any;
  };
}
```

### 2. 核心算法

#### 文档索引过程

1. 提取文档字段
2. 分词处理
3. 构建倒排索引

```typescript
private addToIndex(doc: Document, id: string) {
  const tokens = this.tokenize(doc);

  tokens.forEach(token => {
    if (!this.index[token]) {
      this.index[token] = {};
    }
    // 记录词频
    this.index[token][id] = (this.index[token][id] || 0) + 1;
  });
}
```

#### 搜索评分算法

使用 TF-IDF 算法计算文档相关性:

- TF(词频): 词在文档中出现的次数
- IDF(逆文档频率): log(总文档数/包含该词的文档数)

```typescript
private score(term: string, docId: string): number {
  const tf = this.index[term]?.[docId] || 0;
  const docsWithTerm = Object.keys(this.index[term] || {}).length;
  const idf = Math.log(this.documentCount / (docsWithTerm + 1));

  return tf * idf;
}
```

### 3. 高级功能

#### 分词器

支持自定义分词规则:

```typescript
interface TokenizerOptions {
  separator: RegExp;
  processTerm?: (term: string) => string;
}
```

#### 模糊匹配

支持编辑距离算法进行模糊匹配:

```typescript
function fuzzyMatch(term: string, query: string, maxDistance: number): boolean {
  // 编辑距离计算
  return levenshteinDistance(term, query) <= maxDistance;
}
```

#### 字段权重

可为不同字段设置权重:

```typescript
interface SearchOptions {
  fields: {
    [field: string]: number; // 字段权重
  };
}
```

## 性能优化

1. **索引优化**

   - 使用倒排索引减少搜索复杂度
   - 缓存常用查询结果

2. **内存优化**

   - 最小化文档存储
   - 延迟计算评分

3. **查询优化**
   - 并行处理大规模文档
   - 结果分页

## 使用示例

```typescript
// 创建实例
const miniSearch = new MiniSearch({
  fields: ["title", "content"],
  storeFields: ["title"],
});

// 添加文档
miniSearch.addAll([
  { id: 1, title: "全文搜索", content: "搜索引擎原理..." },
  { id: 2, title: "倒排索引", content: "索引结构..." },
]);

// 搜索
const results = miniSearch.search("搜索", {
  boost: { title: 2 },
  fuzzy: 0.2,
});
```

## 总结

MiniSearch 通过结合倒排索引、TF-IDF 算法和灵活的配置选项,提供了一个高效且易用的全文搜索解决方案。它特别适合中小型应用的搜索需求。

## 参考资源

- [MiniSearch 官方文档](https://lucaong.github.io/minisearch/)
- [倒排索引原理](https://en.wikipedia.org/wiki/Inverted_index)
- [TF-IDF 算法](https://en.wikipedia.org/wiki/Tf-idf)
