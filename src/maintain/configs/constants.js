export const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

export const tailFormItemLayout = {
  wrapperCol: {
    span: 14,
    offset: 6,
  },
};

export const statusText = {
  1: '未审核',
  2: '已通过',
  3: '已拒绝',
  4: '已取消'
};

export const statusFilters = [{
  text: '未审核',
  value: '1'
}, {
  text: '已通过',
  value: '2'
}, {
  text: '已拒绝',
  value: '3'
}];
