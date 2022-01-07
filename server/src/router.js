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
    '/list': async (req, res) => {
      try {
        const data = await get()
        resJson(res, data)
      } catch (err) {
        resJsonError(res, err)
      }
    }
  },
  POST: {
    '/todo': (req, res) => {
      reqCallback(req, async (data) => {
        try {
          const list = await add(data)
          resJson(res, list)
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
          const list = await update(JSON.parse(data))
          resJson(res, list)
        } catch (err) {
          resJsonError(res, err)
        }
      })
    }
  },
  DELETE: {
    '/list': async (req, res) => {
      try {
        const list = await remove(req.params.id)
        resJson(res, list)
      } catch (err) {
        resJsonError(res, err)
      }
    }
  }
}