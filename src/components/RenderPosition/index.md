# RenderPosition

用于实时计算 table 外层 DOM 的高度，通过回调函数传递给子组件， 实现 table 页数过多时，显示在可视区域里；

### author: 王权 ; email: quan.wang@weimob.com

### 引用方式

```javascript
import React from 'react';
import { RenderPosition } from 'components';

class Demo extends React.Components {
  render() {
    <RenderPosition>
      {h => (
        <div style={{ height: h }}>
          <Table
            bordered
            rowSelection={rowSelection}
            columns={this.columns}
            dataSource={list}
            loading={loading}
            rowKey={record => record.id}
            scroll={{ x: this.columns.length * 150, y: h - 30 }}
            pagination={false}
          />
        </div>
      )}
    </RenderPosition>;
  }
}
```
