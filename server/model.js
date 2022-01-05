const uuid = require('uuid')

const list = []

module.exports.add = (data) => {
  list.push({...JSON.parse(data), id: uuid.v4()})
  return list;
}

module.exports.update = (data) => {
  const todoItemIndex = list.findIndex(item => item.id === data.id)
  if (todoItemIndex === -1) {
    throw new Error('未找到更新的id')
  }
  list[todoItemIndex] = data;
  return list;
}

module.exports.remove = (id) => {
  const todoItemIndex = list.findIndex(item => item.id === id)
  list.splice(todoItemIndex, 1)
  return list;
}

module.exports.get = () => {
  return list
}