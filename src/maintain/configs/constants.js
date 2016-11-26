import { mapToFilters } from '../../helpers';

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

export const orderStatus = {
  text: {
    0: '创建',
    1: '已确认',
    2: '已完成',
    3: '已取消'
  }
};

export const closeType = {
  text: {
    1: '应聘者',
    2: '招聘方',
    3: '管理员'
  }
};

export const feedbackType = {
  text: {
    1: '无分类',
    2: '应用相关',
    3: '功能相关'
  }
};

feedbackType.filters = mapToFilters(feedbackType.text);

export const feedbackStatus = {
  text: {
    1: '未处理',
    2: '已处理',
    3: '搁置'
  }
};

feedbackStatus.filters = mapToFilters(feedbackStatus.text);