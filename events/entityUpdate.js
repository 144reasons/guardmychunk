const config = require('../config.json')

module.exports = {
	name: 'entityUpdate',
	once: false,
	async execute(bot, db, entity) {
        if(entity.type === 'player') {
            if(config.owners.includes(entity.username)) return

            let tou = new Date()

            console.log({
                username: entity.username,
                position: {
                    x: Math.round(entity.position.x),
                    y: Math.round(entity.position.y),
                    z: Math.round(entity.position.z)
                },
                tou: tou
            })
    
            let playerinfo = {
                username: entity.username,
                position: {
                    x: Math.round(entity.position.x),
                    y: Math.round(entity.position.y),
                    z: Math.round(entity.position.z)
                },
                tou: tou
            }
    
            let botcoords = {
                x: bot.player.entity.position.x,
                y: bot.player.entity.position.y,
                z: bot.player.entity.position.z
            }
    
            if(playerinfo.username === bot.player.username) return
    
            console.log(botcoords.x)
    
            console.log((playerinfo.position.x - botcoords.x) < 10)
    
            if((playerinfo.position.x - botcoords.x) < 50 && (playerinfo.position.z - botcoords.z) < 50) {
                console.log({
                    x: Math.abs(playerinfo.position.x - botcoords.x),
                    z: Math.abs(playerinfo.position.z - botcoords.z)
                })
    
                let playerdb = await db.get(playerinfo.username)

                if(!playerdb) {
                    const date = playerinfo.tou.toString()

                    playerdb = { info: { username: playerinfo.username }, history: { detected: [{ date: date}] } }
                }
                else {
                    const date = playerinfo.tou.toString()

                    playerdb.history.detected.push({ date: date})
                }

                db.set(playerinfo.username, playerdb)
            }
        }
	},
};

/*
Entity {
  _events: [Object: null prototype] {},
  _eventsCount: 0,
  _maxListeners: undefined,
  id: 3550,
  position: Vec3 { x: 4.5, y: 61, z: 30.5 },
  velocity: Vec3 { x: 0, y: -0.0784000015258789, z: 0 },
  yaw: 3.141592653589793,
  pitch: 0,
  onGround: true,
  height: 1.62,
  width: 0,
  effects: {},
  equipment: [ <5 empty items> ],
  heldItem: null,
  isValid: true,
  metadata: [ <17 empty items>, 127 ],
  username: 'herobrine',
  type: 'player',
  name: 'player',
  timeSinceOnGround: 0,
  isInWater: false,
  isInLava: false,
  isInWeb: undefined,
  isCollidedHorizontally: false,
  isCollidedVertically: true,
  attributes: {
    'minecraft:generic.movement_speed': { value: 0.10000000149011612, modifiers: [] }
  },
  [Symbol(kCapture)]: false
}
*/