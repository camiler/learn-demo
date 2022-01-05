const http = require('http')
const URL = require('url')
const APIMapping = require('./router')

const listener = (req, res) => {
  const url = URL.parse(req.url)
  const {pathname, query} = url;
  const params = new URLSearchParams(url.query)
  req.params = params;
  
  const apiHandler = APIMapping[req.method][url.pathname]
  try {
    apiHandler(req, res);
  } catch (err) {
    res.writeHead(500, err, {
      'Content-Type': 'application/json'
    });
    return res.end('error')
  }
}

http.createServer(listener).listen(3200, () => {
  console.log('open http://localhost:3200')
})