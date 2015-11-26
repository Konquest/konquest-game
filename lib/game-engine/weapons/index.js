var Weapons = {}

Weapons.Laser = require('./laser')
Weapons.RocketLauncher = require('./rocket-launcher')
Weapons.FireGun = require('./fire-gun')

Weapons.registerWeapon = function (key, weaponClass) {
  Weapons[key] = weaponClass
}
Weapons.Weapons = Weapons // so meta

module.exports = Weapons
