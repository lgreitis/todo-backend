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

Jeigu API metodas reikalauja autentifikacijos, tada reikia pridėti užklausoje headerį:

|  Pavadinimas  |    Reikšmė     |
| :-----------: | :------------: |
| Authorization | Bearer {token} |

Jiegu vartotojas neatsiuniča tokeno arba tokenas yra blogas gražina tokius klaidos pranešimas:

| Kodas |      Žinutė       |
| :---: | :---------------: |
|  401  | No token provided |
|  401  |   Invalid token   |

Jeigu API metodas reikalauja specifinės rolės, yra galimas šis klaidos kodas

| Kodas |  Žinutė   |
| :---: | :-------: |
|  403  | Forbidden |

Jeigu API metodo užklausos struktūra yra neteisinga, serveris automatiškai gražins šį klaidos pranešimą:

| Kodas |        Žinutė        |
| :---: | :------------------: |
|  400  | Zod klaidos objektas |

### 1. Index metodai

|                               |                               |
| ----------------------------- | ----------------------------- |
| API metodas                   | index (GET)                   |
| Paskirtis                     | Patikrinti ar serveris veikia |
| Kelias iki metodo             | /                             |
| Užklausos struktūra           | -                             |
| Reikalaujama autentifikacija? | Ne                            |
| Reikalaujama rolė             | -                             |
| Galimi klaidų kodai           | -                             |
| Užklausos pavyzdys            | -                             |
| Gauto atsakymo pavyzdys       | 200 `{"hello":"All good"}`    |

### 2. User metodai

|                               |                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| API metodas                   | getMeta (GET)                                                                                                 |
| Paskirtis                     | Gauti dabartinio vartotojo duomenis                                                                           |
| Kelias iki metodo             | /user                                                                                                         |
| Užklausos struktūra           | -                                                                                                             |
| Atsakymo struktūra            | `{"username":String,"email":String,"id":String,"role":String}`                                                |
| Reikalaujama autentifikacija? | Taip                                                                                                          |
| Reikalaujama rolė             | USER                                                                                                          |
| Galimi klaidų kodai           | -                                                                                                             |
| Užklausos pavyzdys            | -                                                                                                             |
| Gauto atsakymo pavyzdys       | 200 `{"username":"test1","email":"test1@test.com","id":"164704b9-f310-46e9-8448-d3e269d3c205","role":"USER"}` |

|                               |                                                                                                               |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| API metodas                   | changeRole (POST)                                                                                             |
| Paskirtis                     | Pakeisti vartotojo rolę                                                                                       |
| Kelias iki metodo             | /user/role                                                                                                    |
| Užklausos struktūra           | `{"role":String,"userId":String}`                                                                             |
| Atsakymo struktūra            | `{"username":String,"email":String,"id":String,"role":String}`                                                |
| Reikalaujama autentifikacija? | Taip                                                                                                          |
| Reikalaujama rolė             | SUPERADMIN                                                                                                    |
| Galimi klaidų kodai           | -                                                                                                             |
| Užklausos pavyzdys            | `{"role":"USER","userId":"164704b9-f310-46e9-8448-d3e269d3c205"}`                                             |
| Gauto atsakymo pavyzdys       | 200 `{"username":"test1","email":"test1@test.com","id":"164704b9-f310-46e9-8448-d3e269d3c205","role":"USER"}` |

### 3. Auth metodai

|                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ----------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | login (POST)                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Paskirtis                     | Prisijungti prie pasyros                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Kelias iki metodo             | /auth/login                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Užklausos struktūra           | `{"email":String,"password":String}`                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Atsakymo struktūra            | `{"accessToken":String,"refreshToken":String}`                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Reikalaujama autentifikacija? | Ne                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Reikalaujama rolė             | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Galimi klaidų kodai           | 400 `Failed to login, please check your email and password`                                                                                                                                                                                                                                                                                                                                                                                                           |
| Užklausos pavyzdys            | `{"email":"test1@test.com","password":"test123"}`                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Gauto atsakymo pavyzdys       | 200 `{"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2NDcwNGI5LWYzMTAtNDZlOS04NDQ4LWQzZTI2OWQzYzIwNSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjcxNzQ3ODgzLCJleHAiOjE2NzE3NTE0ODN9.4AH8_OyGBI0U4lOniOv9Cke0a1yeOKQT90FNnjYeNBk", "refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2NDcwNGI5LWYzMTAtNDZlOS04NDQ4LWQzZTI2OWQzYzIwNSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjcxNzQ3ODgzLCJleHAiOjE2NzQzMzk4ODN9.TuT9v_J77f0Vx9-rivur1G7V3j4oH3w0nEj2xHLdFyM"}` |

|                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | register (POST)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Paskirtis                     | Sukurti naują paskyrą                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| Kelias iki metodo             | /auth/register                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| Užklausos struktūra           | `{"username":String,"email":String,"password":String}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Atsakymo struktūra            | `{"accessToken":String,"refreshToken":String,"username":String,"email":String,"id":String,"role":String}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Reikalaujama autentifikacija? | Ne                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Reikalaujama rolė             | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Galimi klaidų kodai           | 409 `Failed to register, user already exists`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| Užklausos pavyzdys            | `{"username":"test1","email":"test1@test.com","password":"test123"}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Gauto atsakymo pavyzdys       | 200 `{"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI5NWE3ZjhkLWY4ZGUtNGY3MC05MWQwLWMxN2M0NWY3Y2ExMyIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjcxNzQ5MDI3LCJleHAiOjE2NzE3NTI2Mjd9.zuMeQEGHaWiGw9DxVAEvfIWZPcvPFa9G0tgQtS1SfyE", "refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI5NWE3ZjhkLWY4ZGUtNGY3MC05MWQwLWMxN2M0NWY3Y2ExMyIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjcxNzQ5MDI3LCJleHAiOjE2NzQzNDEwMjd9.RgMxQocF5vOPGe42Ig8fX_qh5IhYJUbmPAty8eqNZk0", "email":"test12@test.com","username":"test123","id":"b95a7f8d-f8de-4f70-91d0-c17c45f7ca13","role":"USER"}` |

|                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | regenerateToken (POST)                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Paskirtis                     | Gauti naują accessToken                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Kelias iki metodo             | /auth/regenerateToken                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Užklausos struktūra           | `{"refreshToken":String}`                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Atsakymo struktūra            | `{"accessToken":String,"refreshToken":String}`                                                                                                                                                                                                                                                                                                                                                                                                                         |
| Reikalaujama autentifikacija? | Ne                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| Reikalaujama rolė             | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| Galimi klaidų kodai           | 400 `User doesn't exist` <br> 400 `Bad refresh token`                                                                                                                                                                                                                                                                                                                                                                                                                  |
| Užklausos pavyzdys            | `{"role":"USER","userId":"164704b9-f310-46e9-8448-d3e269d3c205"}`                                                                                                                                                                                                                                                                                                                                                                                                      |
| Gauto atsakymo pavyzdys       | 200 `{"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2NDcwNGI5LWYzMTAtNDZlOS04NDQ4LWQzZTI2OWQzYzIwNSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjcxNzQ3ODgzLCJleHAiOjE2NzE3NTE0ODN9.4AH8_OyGBI0U4lOniOv9Cke0a1yeOKQT90FNnjYeNBk", "refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjE2NDcwNGI5LWYzMTAtNDZlOS04NDQ4LWQzZTI2OWQzYzIwNSIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjcxNzQ3ODgzLCJleHAiOjE2NzQzMzk4ODN9.TuT9v_J77f0Vx9-rivur1G7V3j4oH3w0nEj2xHLdFyM"}` |

### 4. Directory metodai

|                               |                                                                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | meta (GET)                                                                                                              |
| Paskirtis                     | Gauti organizacijos direktorijos root failus/aplankus                                                                   |
| Kelias iki metodo             | /directory/:organizationId                                                                                              |
| Užklausos struktūra           | -                                                                                                                       |
| Atsakymo struktūra            | `{"items":[{"id":String,"name":String,"parentId":String/ null,"type":String}]}`                                         |
| Reikalaujama autentifikacija? | Taip                                                                                                                    |
| Reikalaujama rolė             | -                                                                                                                       |
| Galimi klaidų kodai           | 404 `Organization not found`                                                                                            |
| Užklausos pavyzdys            | /directory/efca5ca2-543a-4aaa-8095-334a0e2abfd9                                                                         |
| Gauto atsakymo pavyzdys       | 200 `{"items":[{"id":"ca9a8d9c-798a-4cdd-82f3-789d6f146684","name":"23452353245324","parentId":null,"type":"folder"}]}` |

|                               |                                                                                                                                                                                       |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | getFile (GET)                                                                                                                                                                         |
| Paskirtis                     | Gauti organizacijos direktorijos root failus/aplankus                                                                                                                                 |
| Kelias iki metodo             | /directory/organization/:organizationId/folder/:folderId/file/:fileId                                                                                                                 |
| Užklausos struktūra           | /directory/organization/efca5ca2-543a-4aaa-8095-334a0e2abfd9/folder/456d6630-3638-49ee-af34-17939940d86b/file/e692a3f3-59f4-48c3-8786-4c71dded61df                                    |
| Atsakymo struktūra            | `[{"id":String,"name":String,"parentId":String/ null,"data":String,organizationId:String}]`                                                                                           |
| Reikalaujama autentifikacija? | Taip                                                                                                                                                                                  |
| Reikalaujama rolė             | -                                                                                                                                                                                     |
| Galimi klaidų kodai           | 404 `Organization not found` <br> 404 `File does not exist`                                                                                                                           |
| Užklausos pavyzdys            | /directory/efca5ca2-543a-4aaa-8095-334a0e2abfd9                                                                                                                                       |
| Gauto atsakymo pavyzdys       | 200 `{"id":"e692a3f3-59f4-48c3-8786-4c71dded61df","name":"test","parentId":"456d6630-3638-49ee-af34-17939940d86b","data":"","organizationId":"efca5ca2-543a-4aaa-8095-334a0e2abfd9"}` |

|                               |                                                                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | getAll (GET)                                                                                                            |
| Paskirtis                     | Gauti visus failus organizacijoje                                                                                       |
| Kelias iki metodo             | /directory/all/:organizationId                                                                                          |
| Užklausos struktūra           | -                                                                                                                       |
| Atsakymo struktūra            | `{"items":[{"id":String,"name":String,"parentId":String/ null,"type":String}]}`                                         |
| Reikalaujama autentifikacija? | Taip                                                                                                                    |
| Reikalaujama rolė             | -                                                                                                                       |
| Galimi klaidų kodai           | 404, `Organization not found`                                                                                           |
| Užklausos pavyzdys            | /directory/all/efca5ca2-543a-4aaa-8095-334a0e2abfd9                                                                     |
| Gauto atsakymo pavyzdys       | 200 `{"items":[{"id":"ca9a8d9c-798a-4cdd-82f3-789d6f146684","name":"23452353245324","parentId":null,"type":"folder"}]}` |

|                               |                                                                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | getChildren (GET)                                                                                                       |
| Paskirtis                     | Gauti aplanko vaikus                                                                                                    |
| Kelias iki metodo             | /directory/:organizationId/:parentId                                                                                    |
| Užklausos struktūra           | -                                                                                                                       |
| Atsakymo struktūra            | `{"items":[{"id":String,"name":String,"parentId":String/ null,"type":String}]}`                                         |
| Reikalaujama autentifikacija? | Taip                                                                                                                    |
| Reikalaujama rolė             | -                                                                                                                       |
| Galimi klaidų kodai           | 404 `Organization not found`                                                                                            |
| Užklausos pavyzdys            | /directory/efca5ca2-543a-4aaa-8095-334a0e2abfd9/456d6630-3638-49ee-af34-17939940d86b                                    |
| Gauto atsakymo pavyzdys       | 200 `{"items":[{"id":"ca9a8d9c-798a-4cdd-82f3-789d6f146684","name":"23452353245324","parentId":null,"type":"folder"}]}` |

|                               |                                                                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | createItem (POST)                                                                                                       |
| Paskirtis                     | Sukurti naują failą                                                                                                     |
| Kelias iki metodo             | /directory                                                                                                              |
| Užklausos struktūra           | `{"type":String,"name":String,"parentId":String,"organizationId":String}`                                               |
| Atsakymo struktūra            | `{"items":[{"id":String,"name":String,"parentId":String/ null,"type":String}]}`                                         |
| Reikalaujama autentifikacija? | Taip                                                                                                                    |
| Reikalaujama rolė             | -                                                                                                                       |
| Galimi klaidų kodai           | 404 `Organization not found`                                                                                            |
| Užklausos pavyzdys            | `{"organizationId":"ee11a0b5-e026-4e11-be1d-47d6e52f6178","name":"dasd","type":"file"}`                                 |
| Gauto atsakymo pavyzdys       | 200 `{"items":[{"id":"ca9a8d9c-798a-4cdd-82f3-789d6f146684","name":"23452353245324","parentId":null,"type":"folder"}]}` |

|                               |                                                                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | editItem (PATCH)                                                                                                        |
| Paskirtis                     | Pakeisti failo informaciją                                                                                              |
| Kelias iki metodo             | /directory                                                                                                              |
| Užklausos struktūra           | `{"id":String,"name":String,"type":String}`                                                                             |
| Atsakymo struktūra            | `{"items":[{"id":String,"name":String,"parentId":String/ null,"type":String}]}`                                         |
| Reikalaujama autentifikacija? | Taip                                                                                                                    |
| Reikalaujama rolė             | -                                                                                                                       |
| Galimi klaidų kodai           | 404 `Organization not found`                                                                                            |
| Užklausos pavyzdys            | `{"id":"ae623760-3086-4eb8-bc6b-0401074a9728","name":"das","type":"file"}`                                              |
| Gauto atsakymo pavyzdys       | 200 `{"items":[{"id":"ca9a8d9c-798a-4cdd-82f3-789d6f146684","name":"23452353245324","parentId":null,"type":"folder"}]}` |

|                               |                                                                                                                         |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | removeItem (DELETE)                                                                                                     |
| Paskirtis                     | Pašalinti failą                                                                                                         |
| Kelias iki metodo             | /directory/:id/:type                                                                                                    |
| Užklausos struktūra           | -                                                                                                                       |
| Atsakymo struktūra            | `{"items":[{"id":String,"name":String,"parentId":String/ null,"type":String}]}`                                         |
| Reikalaujama autentifikacija? | Taip                                                                                                                    |
| Reikalaujama rolė             | -                                                                                                                       |
| Galimi klaidų kodai           | 404 `Organization not found` <br> 404 `Not Found`                                                                       |
| Užklausos pavyzdys            | `/directory/ae623760-3086-4eb8-bc6b-0401074a9728/file`                                                                  |
| Gauto atsakymo pavyzdys       | 200 `{"items":[{"id":"ca9a8d9c-798a-4cdd-82f3-789d6f146684","name":"23452353245324","parentId":null,"type":"folder"}]}` |

### 5. Invite metodai

|                               |                                                                                                                                                                                                                                                              |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| API metodas                   | getAllInvites (GET)                                                                                                                                                                                                                                          |
| Paskirtis                     | Gauti visas organizacios pakivetimų nuorodas                                                                                                                                                                                                                 |
| Kelias iki metodo             | /invite/organization/:organizationId                                                                                                                                                                                                                         |
| Užklausos struktūra           | -                                                                                                                                                                                                                                                            |
| Atsakymo struktūra            | `[{"id":String,"disabled":Boolean,"dateCreated":String,"expirationDate":String,"organizationId":String,"organization":{"name":String},"_count":{"usersInvited":Number}}]`                                                                                    |
| Reikalaujama autentifikacija? | Taip                                                                                                                                                                                                                                                         |
| Reikalaujama rolė             | OWNER                                                                                                                                                                                                                                                        |
| Galimi klaidų kodai           | 404 `Organization not found`                                                                                                                                                                                                                                 |
| Užklausos pavyzdys            | /invite/organization/ee11a0b5-e026-4e11-be1d-47d6e52f6178                                                                                                                                                                                                    |
| Gauto atsakymo pavyzdys       | 200 `[{"id":"13869489-f2ff-4467-8d1c-bd07250e7b1e","disabled":false,"dateCreated":"1671742553943","expirationDate":"1672437600000","organizationId":"ee11a0b5-e026-4e11-be1d-47d6e52f6178","organization":{"name":"asdfafsd"},"_count":{"usersInvited":1}}]` |

|                               |                                                                                                                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| API metodas                   | getInvite (GET)                                                                                                                                                                                                                |
| Paskirtis                     | Gauti pakvietimo informaciją                                                                                                                                                                                                   |
| Kelias iki metodo             | /invite/:id                                                                                                                                                                                                                    |
| Užklausos struktūra           | -                                                                                                                                                                                                                              |
| Atsakymo struktūra            | `{"id":String,"disabled":Boolean,"dateCreated":String,"expirationDate":String,"organizationId":String,"organization":{"name":String}}` -                                                                                       |
| Reikalaujama autentifikacija? | Ne                                                                                                                                                                                                                             |
| Reikalaujama rolė             | -                                                                                                                                                                                                                              |
| Galimi klaidų kodai           | 404 `Couldn't find an invite`                                                                                                                                                                                                  |
| Užklausos pavyzdys            | /invite/13869489-f2ff-4467-8d1c-bd07250e7b1e                                                                                                                                                                                   |
| Gauto atsakymo pavyzdys       | 200 `{"id":"13869489-f2ff-4467-8d1c-bd07250e7b1e","disabled":false,"dateCreated":"1671742553943","expirationDate":"1672437600000","organizationId":"ee11a0b5-e026-4e11-be1d-47d6e52f6178","organization":{"name":"asdfafsd"}}` |

|                               |                                                                                                                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | createInvite (POST)                                                                                                                                                                         |
| Paskirtis                     | Sukurti organizacijos pakvieitmą                                                                                                                                                            |
| Kelias iki metodo             | /invite                                                                                                                                                                                     |
| Užklausos struktūra           | {"organizationId":String,"expirationDate":Number}                                                                                                                                           |
| Atsakymo struktūra            | `{"id":String,"disabled":Boolean,"dateCreated":String,"expirationDate":String,"organizationId":String}`                                                                                     |
| Reikalaujama autentifikacija? | Taip                                                                                                                                                                                        |
| Reikalaujama rolė             | OWNER                                                                                                                                                                                       |
| Galimi klaidų kodai           | 404 `Organization not found`                                                                                                                                                                |
| Užklausos pavyzdys            | `{"organizationId":"ee11a0b5-e026-4e11-be1d-47d6e52f6178","expirationDate":1672437600000}`                                                                                                  |
| Gauto atsakymo pavyzdys       | 200 `{"id":"07424fc1-cc36-4ce9-9b99-0201df0ec34d","disabled":false,"dateCreated":"1671753885981","expirationDate":"1672437600000","organizationId":"ee11a0b5-e026-4e11-be1d-47d6e52f6178"}` |

|                               |                                                                                                                                                                                            |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| API metodas                   | editInvite (PATCH)                                                                                                                                                                         |
| Paskirtis                     | Keisti organizacijos informaciją                                                                                                                                                           |
| Kelias iki metodo             | /invite                                                                                                                                                                                    |
| Užklausos struktūra           | {"id":String,"expirationDate":Number,"disabled":Boolean}                                                                                                                                   |
| Atsakymo struktūra            | `{"id":String,"disabled":Boolean,"dateCreated":String,"expirationDate":String,"organizationId":String`                                                                                     |
| Reikalaujama autentifikacija? | Taip                                                                                                                                                                                       |
| Reikalaujama rolė             | OWNER                                                                                                                                                                                      |
| Galimi klaidų kodai           | 404 `Organization not found`                                                                                                                                                               |
| Užklausos pavyzdys            | `{"id":"07424fc1-cc36-4ce9-9b99-0201df0ec34d","expirationDate":1672437600000,"disabled":true}`                                                                                             |
| Gauto atsakymo pavyzdys       | 200 `{"id":"07424fc1-cc36-4ce9-9b99-0201df0ec34d","disabled":true,"dateCreated":"1671753885981","expirationDate":"1672437600000","organizationId":"ee11a0b5-e026-4e11-be1d-47d6e52f6178"}` |

|                               |                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | createInviteUser (POST)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| Paskirtis                     | Sukurti naują vartotoją ir pridėti į organizaciją                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Kelias iki metodo             | /invite/createUser                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Užklausos struktūra           | {"username":String,"email":String,"password":String,"inviteId":String}                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Atsakymo struktūra            | `{"accessToken":String,"refreshToken":String,"username":String,"email":String,"id":String,"role":String}`                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Reikalaujama autentifikacija? | Ne                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| Reikalaujama rolė             | -                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Galimi klaidų kodai           | 400 `This invite is not valid` <br> 400 `This organization doesn't exist`                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| Užklausos pavyzdys            | `{"username":"test1","email":"test1@test.com","password":"test123","inviteId":"07424fc1-cc36-4ce9-9b99-0201df0ec34d"}`                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| Gauto atsakymo pavyzdys       | 200 `{"accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI5NWE3ZjhkLWY4ZGUtNGY3MC05MWQwLWMxN2M0NWY3Y2ExMyIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjcxNzQ5MDI3LCJleHAiOjE2NzE3NTI2Mjd9.zuMeQEGHaWiGw9DxVAEvfIWZPcvPFa9G0tgQtS1SfyE", "refreshToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImI5NWE3ZjhkLWY4ZGUtNGY3MC05MWQwLWMxN2M0NWY3Y2ExMyIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNjcxNzQ5MDI3LCJleHAiOjE2NzQzNDEwMjd9.RgMxQocF5vOPGe42Ig8fX_qh5IhYJUbmPAty8eqNZk0", "email":"test12@test.com","username":"test123","id":"b95a7f8d-f8de-4f70-91d0-c17c45f7ca13","role":"USER"}` |

|                               |                                                                           |
| ----------------------------- | ------------------------------------------------------------------------- |
| API metodas                   | addUser (POST)                                                            |
| Paskirtis                     | Pridėti vartotoją prie organizacijos                                      |
| Kelias iki metodo             | /invite/addUser                                                           |
| Užklausos struktūra           | `{"inviteId":String}`                                                     |
| Atsakymo struktūra            | -                                                                         |
| Reikalaujama autentifikacija? | Taip                                                                      |
| Reikalaujama rolė             | -                                                                         |
| Galimi klaidų kodai           | 400 `This invite is not valid` <br> 400 `This organization doesn't exist` |
| Užklausos pavyzdys            | `{"inviteId":"b95a7f8d-f8de-4f70-91d0-c17c45f7ca13"}`                     |
| Gauto atsakymo pavyzdys       | 200                                                                       |

### 6. Organization metodai

|                               |                                                                                                                               |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | createOrganization (POST)                                                                                                     |
| Paskirtis                     | Sukurti naują organizaciją                                                                                                    |
| Kelias iki metodo             | /organization                                                                                                                 |
| Užklausos struktūra           | `{"name":String}`                                                                                                             |
| Atsakymo struktūra            | `{"name":String,"id":String,"ownerUser":{"username":String,},"_count":{"users":Number,"files":Number}`                        |
| Reikalaujama autentifikacija? | Taip                                                                                                                          |
| Reikalaujama rolė             | -                                                                                                                             |
| Galimi klaidų kodai           | -                                                                                                                             |
| Užklausos pavyzdys            | `{"name":"das"}`                                                                                                              |
| Gauto atsakymo pavyzdys       | `{"id":"8fe597fc-8713-4d33-a94f-44c285348848","name":"das","ownerUser":{"username":"test1"},"\_count":{"files":0,"users":1}}` |

|                               |                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| API metodas                   | listOrganizations (GET)                                                                                                        |
| Paskirtis                     | Gauti visas vartotojo organizacijas                                                                                            |
| Kelias iki metodo             | /organization                                                                                                                  |
| Užklausos struktūra           | -                                                                                                                              |
| Atsakymo struktūra            | `[{"name":String,"id":String,"ownerUser":{"username":String,},"_count":{"users":Number,"files":Number}]`                       |
| Reikalaujama autentifikacija? | Taip                                                                                                                           |
| Reikalaujama rolė             | -                                                                                                                              |
| Galimi klaidų kodai           | -                                                                                                                              |
| Užklausos pavyzdys            | -                                                                                                                              |
| Gauto atsakymo pavyzdys       | `[{"id":"8fe597fc-8713-4d33-a94f-44c285348848","name":"das","ownerUser":{"username":"test1"},"_count":{"files":0,"users":1}}]` |

|                               |                                                                                                                                |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| API metodas                   | listAllOrganizations (GET)                                                                                                     |
| Paskirtis                     | Gauti visas organizacijas SUPERADMIN rolei                                                                                     |
| Kelias iki metodo             | /organization/superadmin                                                                                                       |
| Užklausos struktūra           | -                                                                                                                              |
| Atsakymo struktūra            | `[{"name":String,"id":String,"ownerUser":{"username":String,},"_count":{"users":Number,"files":Number}]`                       |
| Reikalaujama autentifikacija? | Taip                                                                                                                           |
| Reikalaujama rolė             | SUPERADMIN                                                                                                                     |
| Galimi klaidų kodai           | -                                                                                                                              |
| Užklausos pavyzdys            | -                                                                                                                              |
| Gauto atsakymo pavyzdys       | `[{"id":"8fe597fc-8713-4d33-a94f-44c285348848","name":"das","ownerUser":{"username":"test1"},"_count":{"files":0,"users":1}}]` |

|                               |                                                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | getOrganization (GET)                                                                                                        |
| Paskirtis                     | Gauti organizaciją                                                                                                           |
| Kelias iki metodo             | /organization/:id                                                                                                            |
| Užklausos struktūra           | -                                                                                                                            |
| Atsakymo struktūra            | `{"name":String,"id":String,"ownerUser":{"username":String,},"_count":{"users":Number,"files":Number}`                       |
| Reikalaujama autentifikacija? | Taip                                                                                                                         |
| Reikalaujama rolė             | -                                                                                                                            |
| Galimi klaidų kodai           | 404 `Organization not found`                                                                                                 |
| Užklausos pavyzdys            | -                                                                                                                            |
| Gauto atsakymo pavyzdys       | `{"id":"8fe597fc-8713-4d33-a94f-44c285348848","name":"das","ownerUser":{"username":"test1"},"_count":{"files":0,"users":1}}` |

|                               |                                                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | editOrganization (PATCH)                                                                                                     |
| Paskirtis                     | Keisti organizacijos informaciją                                                                                             |
| Kelias iki metodo             | /organization                                                                                                                |
| Užklausos struktūra           | `{"name":String,"id":String}`                                                                                                |
| Atsakymo struktūra            | `{"name":String,"id":String,"ownerUser":{"username":String,},"_count":{"users":Number,"files":Number}`                       |
| Reikalaujama autentifikacija? | Taip                                                                                                                         |
| Reikalaujama rolė             | OWNER                                                                                                                        |
| Galimi klaidų kodai           | 404 `Organization not found`                                                                                                 |
| Užklausos pavyzdys            | `{"name":"test","id":"8fe597fc-8713-4d33-a94f-44c285348848"}`                                                                |
| Gauto atsakymo pavyzdys       | `{"id":"8fe597fc-8713-4d33-a94f-44c285348848","name":"das","ownerUser":{"username":"test1"},"_count":{"files":0,"users":1}}` |

|                               |                                                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | addUserToOrganization (POST)                                                                                                 |
| Paskirtis                     | Pridėti vartotoją į organizaciją                                                                                             |
| Kelias iki metodo             | /organization/add                                                                                                            |
| Užklausos struktūra           | `{"userId":String,"id":String}`                                                                                              |
| Atsakymo struktūra            | `{"name":String,"id":String,"ownerUser":{"username":String,},"_count":{"users":Number,"files":Number}`                       |
| Reikalaujama autentifikacija? | Taip                                                                                                                         |
| Reikalaujama rolė             | OWNER                                                                                                                        |
| Galimi klaidų kodai           | 404 `Organization not found`                                                                                                 |
| Užklausos pavyzdys            | `{"id":"8fe597fc-8713-4d33-a94f-44c285348848", userId:"164704b9-f310-46e9-8448-d3e269d3c205"}`                               |
| Gauto atsakymo pavyzdys       | `{"id":"8fe597fc-8713-4d33-a94f-44c285348848","name":"das","ownerUser":{"username":"test1"},"_count":{"files":0,"users":1}}` |

|                               |                                                                                                                              |
| ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| API metodas                   | removeUserFromOrganization (POST)                                                                                            |
| Paskirtis                     | Pašalinti vartotoją iš organizacijos                                                                                         |
| Kelias iki metodo             | /organization/remove                                                                                                         |
| Užklausos struktūra           | `{"userId":String,"id":String}`                                                                                              |
| Atsakymo struktūra            | `{"name":String,"id":String,"ownerUser":{"username":String,},"_count":{"users":Number,"files":Number}`                       |
| Reikalaujama autentifikacija? | Taip                                                                                                                         |
| Reikalaujama rolė             | OWNER                                                                                                                        |
| Galimi klaidų kodai           | 404 `Organization not found` <br> 400 `Can't remove owner from organization`                                                 |
| Užklausos pavyzdys            | `{"id":"8fe597fc-8713-4d33-a94f-44c285348848", userId:"164704b9-f310-46e9-8448-d3e269d3c205"}`                               |
| Gauto atsakymo pavyzdys       | `{"id":"8fe597fc-8713-4d33-a94f-44c285348848","name":"das","ownerUser":{"username":"test1"},"_count":{"files":0,"users":1}}` |

|                               |                                                    |
| ----------------------------- | -------------------------------------------------- |
| API metodas                   | deleteOrganization (DELETE)                        |
| Paskirtis                     | Pašalinti organizaciją                             |
| Kelias iki metodo             | /organization/:id                                  |
| Užklausos struktūra           | -                                                  |
| Atsakymo struktūra            | -                                                  |
| Reikalaujama autentifikacija? | Taip                                               |
| Reikalaujama rolė             | OWNER                                              |
| Galimi klaidų kodai           | 404 `Organization not found`                       |
| Užklausos pavyzdys            | /organization/8fe597fc-8713-4d33-a94f-44c285348848 |
| Gauto atsakymo pavyzdys       | 200                                                |

## 5. Išvados

1. Realizuota REST principais paremtas API serveris su 27 metodais, kurių didelė dalis nebuvo reikalinga.
1. Išbandytas naujas dizaino stilius vartotojo sąsajoje, kuris yra minimalistinis ir modernus.
1. Realizuota `JWT refresh token` autentifikacija.
1. Išbandyta nauja API užklausų valdymo sistema vartotojo sąsajoje `redux toolkit query`
1. Išbandyta nauja ORM biblioteka serveryje `prisma`, kuri leidžia lengvai atlikti migracijas, valdyti duomenų bazę, kurti naujus modelius ir juos integruoti tieisiai į typescript serverį
