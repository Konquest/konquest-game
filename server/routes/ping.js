module.exports = function Ping (req, res) {
  res.send({
    name: req.app.get('name'),
    version: req.app.get('version'),
    status: req.app.get('status')
  })
}
