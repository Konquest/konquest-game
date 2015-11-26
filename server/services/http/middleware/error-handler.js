module.exports = function (err, req, res, next) {
  var status = err.status ? err.status : 500
  var code = status

  if (err.code) {
    code += '.' + err.code
  }

  if (status >= 500) {
    console.error(err.stack)
  }

  res.status(status).send({
    code: code,
    message: err.message
  })
}
