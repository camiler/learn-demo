const { default: axios } = require('axios')

Promise.all([
  axios.post('http://localhost:3200/list', {name: 'todo1'}),
  axios.post('http://localhost:3200/list', {name: 'todo2'})
]).then(res => {
  const [resA, resB] = res;
  console.log(resA.data, resB.data)
})
