const http = require('http')
const app = require('./src/app')
const { connect } = require('./src/db')

try {
  connect(() => {
    http.createServer(app).listen(8080, () => {
      console.log('open http://localhost:8080')
    })
  })
} catch (err) {
  console.log(err)
  console.log('mysql connect failed')
}
