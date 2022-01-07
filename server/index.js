const http = require('http')
const app = require('./src/app')

http.createServer(app).listen(3200, () => {
  console.log('open http://localhost:3200')
})