/* globals Phaser */

function rgbToHex (r, g, b) {
  return '0x' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
}

var HealthBar = module.exports = function (game, followSprite, total, width) {
  // console.log(followSprite.x, followSprite.y)
  Phaser.Graphics.call(this, game, followSprite.x, followSprite.y)

  this.sprite = followSprite
  this.hp = total
  this.totalhp = total
  this.barWidth = width
  // this._lasthp = 0
}

HealthBar.prototype = Object.create(Phaser.Graphics.prototype)
HealthBar.prototype.constructor = HealthBar

HealthBar.prototype.update = function () {
  this.x = this.sprite.x
  this.y = this.sprite.y

  // console.log('draw healthbar')
  if (this._lasthp !== this.hp) {
    this.clear()
    var x = (this.hp / this.totalhp) * 100
    var colour = rgbToHex((x > 50 ? 1 - 2 * (x - 50) / 100.0 : 1.0) * 255, (x > 50 ? 1.0 : 2 * x / 100.0) * 255, 0)

    this.beginFill(colour)
    this.lineStyle(5, colour, 1)
    this.moveTo(0, -5)
    this.lineTo(this.barWidth * this.hp / this.totalhp, -5)
    this.endFill()
    this._lasthp = this.hp
  }
}
