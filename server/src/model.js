const uuid = require('uuid')
const fs = require('fs/promises')

const FS_NAME = 'todo.json'

const getFileData = async () => {
  try {
    const f = await fs.readFile(FS_NAME);
    const list = JSON.parse(f.toString());
    return list;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return []
    }
    throw err;
  }
}

module.exports.add = async (data) => {
  const list = await getFileData()
  const d = {...JSON.parse(data), id: uuid.v4()}
  list.push(d)
  await fs.writeFile(FS_NAME, JSON.stringify(list))
  return list;
}

module.exports.update = async (data) => {
  const list = await getFileData()
  const todoItemIndex = list.findIndex(item => item.id === data.id)
  if (todoItemIndex === -1) {
    throw new Error('未找到更新的id')
  }
  list[todoItemIndex] = data;
  await fs.writeFile(FS_NAME, JSON.stringify(list))
  return list;
}

module.exports.remove = async (id) => {
  const list = await getFileData()
  const todoItemIndex = list.findIndex(item => item.id === id)
  if (todoItemIndex === -1) {
    throw new Error('未找到删除的id')
  }
  list.splice(todoItemIndex, 1)
  await fs.writeFile(FS_NAME, JSON.stringify(list))
  return list;
}

module.exports.get = async () => {
  return await getFileData()
}