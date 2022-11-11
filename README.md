# TODO

## Lauching:

1. Install postgresql server
1. Set DATABASE_URL value with database URI in `.env` file
1. Install yarn package manager
1. Run `yarn` to install packages
1. Run the server with:
   1. `yarn dev` to start development server
   1. `yarn start` to start production server
   1. `pm2 start ecosystem.config.js --only prod` to start a clusterized server with `pm2` process manager

## Deployment

1. Follow all the instructions in `Launching` section and run the server with the third option
1. Install nginx in the server and use the included `nginx.conf` to setup a reverse proxy for the server
   - Optionally setup ssl with [this](https://certbot.eff.org/instructions?ws=nginx&os=ubuntufocal) tutorial
1. Run `pm2 startup` and `pm2 save` to setup automatic server start on system reboot/poweroff
   - Other times after changing cluster size or other options you only have to run `pm2 save` command

## Routes:

- Index routes `/`
- Auth routes `/auth`
- Directory routes `/user`
- Invite routes `/invite`
- Organization routes `/organization`
- User routes `/user`
