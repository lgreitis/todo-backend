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

## 1. Sprendžiamo uždavinio aprašymas

### 1.1. Sistemos paskirtis

Projekto tikslas – leisti komandoms dirbti ir organizuotis kartu be jokių kliūčių.

Veikimo principas – komandų vartotojai, ir sistemos administratorius naudosis internetine
aplikacija, kuri komunikuos su su serveriu naudojant aplikacijų programavimo sąsaja (angl.
API).

Komandos vadovas, norėdamas naudotis šia platforma, prisiregistruos prie internetinės
aplikacijos ir sukurs komandą. Naudodamas pakvietimo nuorodą komandos vadovas pakvies
savo komandos narius. Komandos vadovas ir nariai galės kurti aplankus komandos
direktorijoje taip pat ir kurti failus, kuriuos gyvai gali redaguoti keli vartotojai. Komandos
vadovas taip pat gali valdyti pakvietimo nuorodas ir pridėti, redaguoti, pašalinti ir peržiūrėti
komandos narius. Sistemos administratorius galės peržiūrėti komandas ir jos narius ir juos
valdyti.

### 1.2. Funkciniai reikalavimai

Neregistruotas sistemos naudotojas galės:

1. Peržiūrėti platformos prisijungimo ir registracijos puslapį;
1. Prisijungti arba užsiregistruoti prie internetinės aplikacijos;
1. Atidaryti pakvietimo nuorodą ir prisijungi arba prisiregistruoti;

Registruotas sistemos naudotojas galės:

1. Atsijungti nuo internetinės aplikacijos;
1. Prisijungti prie platformos;
1. Sukurti naują komandą;

   1. Užpildyti komandos informacijos formą;
   1. Pridėti narius;
   1. Pridėti aplankus ir failus;
   1. Redaguoti aplankus ir failus;

1. Peržiūrėti ir keisti kitų komandos narių informaciją;

Administratorius galės:

1. Peržiūrėti, šalinti ir keisti naudotojus;
1. Peržiūrėti, šalinti ir keisti komandas;

## 2. Sistemos architektūra

Sistemos sudedamosios dalys:

- Kliento pusė (ang. Front-End) – naudojant React.js;
- Linux serverio pusė (angl. Back-End) – naudojant Node.js. Duomenų bazė –
  PostgreSQL. Klusterizacijos valdytojas – pm2. Reverse proxy serveris – nginx.

![Sistemos TODO diegimo diagrama](/docs/images/Sistemos_TODO_diegimo_diagrama.png 'Sistemos TODO diegimo diagrama')
