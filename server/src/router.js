const {add, update, remove, getList} = require('./model')

const reqCallback = (req, callback) => {
  let data = null;
  req.on('data', (d) => {
    data = d;
  })
  req.on('end', () => {
    callback(JSON.parse(data.toString()))
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

const resJsonError = (res, err, code = 500) => {
  res.writeHead(code, err, {
    'Content-Type': 'application/json'
  });
  res.end(JSON.stringify({code, message: err.message}))
}

module.exports = {
  GET: {
    '/': (req, res) => {
      resRender(res, "Welcome to the homepage!")
    },
    '/list': async (req, res) => {
      try {
        getList(req.params, (docs) => {
          resJson(res, docs)
        })
      } catch (err) {
        resJsonError(res, err)
      }
    }
  },
  POST: {
    '/todo': (req, res) => {
      reqCallback(req, async (data) => {
        try {
          if (!data.title) {
            return resJsonError(res, new Error('title不能为空'), 400)
          }
          add(data, (docs) => {
            resJson(res, docs)
          })
        } catch (err) {
          resJsonError(res, err)
        }
      })
    }
  },
  PUT: {
    '/todo': (req, res) => {
      reqCallback(req, async data => {
        try {
          update(data, (docs) => {
            resJson(res, docs)
          })
        } catch (err) {
          resJsonError(res, err)
        }
      })
    }
  },
  DELETE: {
    '/list': async (req, res) => {
      try {
        remove(req.params.id, (docs) => {
          resJson(res, docs)
        })
      } catch (err) {
        resJsonError(res, err)
      }
    }
  }
}