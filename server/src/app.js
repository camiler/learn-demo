const URL = require('url')
const APIMapping = require('./router')

const app = (req, res) => {
  const url = URL.parse(req.url)
  const {pathname, query} = url;
  const params = new URLSearchParams(url.query)
  req.params = {};
  for (const [name, value] of params) {
    req.params[name] = value
  }
  
  const apiHandler = APIMapping[req.method][url.pathname]
  try {
    apiHandler(req, res);
  } catch (err) {
    res.writeHead(500, err, {
      'Content-Type': 'application/json'
    });
    res.end('error')
  }
}

module.exports = app;