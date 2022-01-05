const {add, update, remove, get} = require('./model')

const reqCallback = (req, callback) => {
  let data = null;
  req.on('data', (d) => {
    data = d;
  })
  req.on('end', () => {
    callback(data.toString())
  })
}

const resJson = (res, obj) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(obj))
}

const resRender = (res, render) => {
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(render);
}

const resJsonError = (res, err) => {
  res.writeHead(500, err, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({code: 500, message: err.message}))
}

module.exports = {
  GET: {
    '/': (req, res) => {
      resRender(res, "Welcome to the homepage!")
    },
    '/list': (req, res) => {
      resJson(res, get())
    }
  },
  POST: {
    '/todo': (req, res) => {
      reqCallback(req, (data) => {
        resJson(res, add(data))
      })
    }
  },
  PUT: {
    '/todo': (req, res) => {
      reqCallback(req, data => {
        try {
          const list = update(JSON.parse(data))
          resJson(res, list)
        } catch (err) {
          resJsonError(res, err)
        }
      })
    }
  },
  DELETE: {
    '/list': (req, res) => {
      try {
        const list = remove(req.params.id)
        resJson(res, list)
      } catch (err) {
        resJsonError(res, err)
      }
    }
  }
}