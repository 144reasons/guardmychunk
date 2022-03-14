const fs = require('fs')
const mineflayer = require('mineflayer');
const prefix = '!'
const Josh = require("@joshdb/core");
const provider = require("@joshdb/sqlite");
const config = require('./config.json')

const db = new Josh({
    name: 'bot',
    provider,
});

const options = {
    host: config.ip,
    port: config.port,
    username: config.username,
    password: config.password
}

const bot = mineflayer.createBot(options)

db.defer.then(() => {
    console.log(`Connected to DB`);
});

// bot.setSettings({ viewDistance: 'tiny' })

bot.settings = { viewDistance: 2}

const commandfiles = fs.readdirSync(__dirname + '/commands').filter(file => file.endsWith('.js'));

let commands = []

for (const val of commandfiles) {
    commands.push(val.replace('.js', ''))
}

const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const event = require(`./events/${file}`);
	if (event.once) {
		bot.once(event.name, (...args) => event.execute(bot, db, ...args));
	} else {
		bot.on(event.name, (...args) => event.execute(bot, db, ...args));
	}
}


bot.on('chat', (username, message) => {
    if(!message.startsWith(prefix) || username === bot.username) return

    const args = message.slice(prefix.length).trim().split(/ +/);

    const command = args.shift().toLowerCase();

    if (!commands.includes(command)) return;

    const torun = require(__dirname + '/commands/' + command + '.js')

    torun.execute(bot, args)
})

// bot.on('entitySpawn', (entity) => {
//     if(entity.type === 'player') {
//         console.log({
//             username: entity.username,
//             position: {
//                 x: Math.round(entity.position.x),
//                 y: Math.round(entity.position.y),
//                 z: Math.round(entity.position.z)
//             },
//             tou: Date.now()
//         })

//         let playerinfo = {
//             username: entity.username,
//             position: {
//                 x: Math.round(entity.position.x),
//                 y: Math.round(entity.position.y),
//                 z: Math.round(entity.position.z)
//             },
//             tou: Date.now()
//         }

//         let botcoords = {
//             x: bot.player.entity.position.x,
//             y: bot.player.entity.position.y,
//             z: bot.player.entity.position.z
//         }

//         if(playerinfo.username === bot.player.username) return

//         console.log(botcoords.x)

//         console.log((playerinfo.position.x - botcoords.x) < 10)

//         if((playerinfo.position.x - botcoords.x) < 50 && (playerinfo.position.z - botcoords.z) < 50) {
//             console.log({
//                 x: Math.abs(playerinfo.position.x - botcoords.x),
//                 z: Math.abs(playerinfo.position.z - botcoords.z)
//             })

//             console.log('PLAYER IS A THREAT, BEWARE')
//         }
//     }
// })

/*
NOTES:
`type` can be "object", "mob", or "player". "player" is the type we need. 
*/

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

bot.on('kicked', console.log)
bot.on('error', console.log)