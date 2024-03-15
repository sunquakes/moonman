---
lang: en-US
title: SQLite3
---

## 新建表

```js
import { execute } from '../src/db/sqlite3'
const sql =
  'CREATE TABLE IF NOT EXISTS test (' +
  'id Integer PRIMARY KEY AUTOINCREMENT,' +
  'content VARCHAR(255) NOT NULL DEFAULT ""' +
  ')'
execute(sql).then((err) => {
  console.log(err)
})
```

## 新增

```js
import { save } from '../src/db/sqlite3'
save('table_name', { content: 'Hello World!' }).then((id) => {
  // The insert row id.
  console.log(id)
})
```

## 删除

```js
import { remove } from '../src/db/sqlite3'
remove('table_name', [id, 1]).then((err) => {
  console.log(err)
})
```

## 更新 

```js
import { updateById } from '../src/db/sqlite3'
updateById('table_name', 2, { content: 'Hello China!' }).then((id) => {
  // The update row id.
  console.log(id)
})
```

## 查询

```js
import { list } from '../src/db/sqlite3'
list('table_name', []).then((rows) => {
  // Rows.
  console.log(rows)
})
```
