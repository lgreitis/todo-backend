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

## 3. Naudotojo sąsajos projektas

Github repozitorija: https://github.com/lgreitis/todo-client

1. Pagrindinis puslapis, kai vartotojas nėra prisijungęs
   ![Pagrindinis langas, kai vartotojas nėra prisijungęs wireframe](/docs/images/Landing_Unauth_Wireframe.png)
   ![Pagrindinis langas, kai vartotojas nėra prisijungęs](/docs/images/Landing_Unauth.png)

1. Prisijungimo puslapis
   ![Prisijungimo puslapis wireframe](/docs/images/Login_Wireframe.png)
   ![Prisijungimo puslapis](/docs/images/Login.png)

1. Registracijos puslapis
   ![Registracijos puslapis wireframe](/docs/images/Register_Wireframe.png)
   ![Registracijos puslapis](/docs/images/Register.png)

1. Registracijos puslapis, kai vartotojas yra pakviečiamas
   ![Registracijos puslapis, kai vartotojas yra pakviečiamas wireframe](/docs/images/Invite_Register_Wireframe.png)
   ![Registracijos puslapis, kai vartotojas yra pakviečiamas](/docs/images/Invite_Register.png)

1. Pakvietimo puslapis
   ![Pakvietimo puslapis wireframe](/docs/images/Invite_Wireframe.png)
   ![Pakvietimo puslapis](/docs/images/Invite.png)

1. Pagrindinis puslapis
   ![Pagrindinis puslapis wireframe](/docs/images/Dash_Wireframe.png)
   ![Pagrindinis puslapis](/docs/images/Dash.png)

1. Admin lentelių puslapio atvaizdavimas
   ![Admin lentelių puslapio atvaizdavimas wireframe](/docs/images/Table_Wireframe.png)
   ![Admin lentelių puslapio atvaizdavimas](/docs/images/Table.png)

1. Organizacijos pakvietimų valdymo puslapis
   ![Organizacijos pakvietimų valdymo puslapis wireframe](/docs/images/Org_Invites_Wireframe.png)
   ![Organizacijos pakvietimų valdymo puslapis](/docs/images/Org_Invites.png)

1. Editoriaus puslapis
   ![Editoriaus puslapis wireframe](/docs/images/Editor_Wireframe.png)
   ![Editoriaus puslapis](/docs/images/Editor.png)

1. Modalo komponentas
   ![Modalo komponentas wireframe](/docs/images/Modal_Wireframe.png)
   ![Modalo komponentas](/docs/images/Modal.png)

1. Vartotojo nustatymų komponentas
   ![Vartotojo nustatymų komponentas wireframe](/docs/images/Settings_Wireframe.png)
   ![Vartotojo nustatymų komponentas](/docs/images/Settings.png)

1. Hamburger meniu komponentas
   ![Hamburger meniu komponentas wireframe](/docs/images/Hamburger_Wireframe.png)
   ![Hamburger meniu komponentas](/docs/images/Hamburger.png)

## 4. API specifikacija

## 4. Išvados
