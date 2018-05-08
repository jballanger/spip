# spip

<p align="center">
  <img src="https://vignette.wikia.nocookie.net/spirou/images/f/f7/Spip.gif/revision/latest?path-prefix=fr" alt="spip">
</p>

spip is a Discord bot written in [Node.js](https://nodejs.org) with [discord.js](https://discord.js.org).

This bot is not intended to be a public bot (for now), so if you want it you will have to make it work yourself.

Any PRs are welcome !

## Table of contents
- [Core](#core)
- [Commands](#commands)
- [Credits](#credits)

## Core

### CommandManager
CommandManager will allow to load and execute every commands in `src/Commands` automatically.

### Database
Database is here to create and interact with the database connection.

### DiscordClient
DiscordClient is the main class, it will load every Core files and later init them.

### Educator
Educator allow to register a list of words in `src/Misc/educator/wlist.txt`.
When any of those words are written, *spip* will assign a role for a specific period of time to the user who written them.

### HinataFeed
HinataFeed is fetching a json file from [Hinata-Online Community](http://hinata-online-community.fr/) every 2 seconds to send a message when a new video is available.

### ImportManager
ImportManager is used by **CommandManager** to load every `.js` files in the `src/Commands` directory.

### MusicManager
MusicManager is a simple voice handler to allow spip to stream music from [Youtube](https://www.youtube.com).

### Stats
Stats allow users in the same guild as *spip* to earn exp based on their activity.

### Utils
Utils contain methods that could be used anywhere in the code.

## Commands
The commands list can be found [here](https://github.com/jballanger/spip/tree/master/src/Commands) :).

## Credits
*spip* was written with taking some ideas from [blargbot](https://github.com/blargbot/blargbot) and [SharpBot](https://github.com/RayzrDev/SharpBot).

Thanks to them.
