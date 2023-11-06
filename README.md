<!-- ABOUT THE PROJECT -->
## About The Project

Textquiz bot with ChatGPT on board for telegram. Feel free to use project and have fun with your friends!

### Built With

* [![NodeJS][NodeJS.com]][NodeJS-url]
* [![MySQL][MySQL.com]][MySQL-url]
* [![Grammy][Grammy.com]][Grammy-url]
* [![OpenAI][OpenAI.com]][OpenAI-url]

<!-- GETTING STARTED -->
## Getting Started

### Installation

1. Get a free token at [https://telegram.com](https://telegram.com) using @botfather
2. Get a API Key at [https://openai.com](https://openai.com)
3. Clone the repo
   ```sh
   git clone https://github.com/drogonov/lwts
   ```
4. Install NPM packages
   ```sh
   cd ./lwts-app
   npm install
   ```
5. Create local envirionment `./lwts/.env` with this variables
   ```js
    PORT=8089

    DB_HOST=localhost
    DB_USER=root

    DB_PASSWORD=QWERTY
    DB_NAME=long-way-to-shagarovka
    DB_PORT=3306

    TELEGRAM_TOKEN=ENTER YOUR TOKEN
    OPENAI_API_KEY=ENTER YOUR API
   ```
6. Create envirionment for docker-compose `/.env` with this variables
   ```js
    NODE_LOCAL_PORT=8089
    NODE_DOCKER_PORT=8089

    MYSQLDB_ROOT_USER=root
    MYSQLDB_ROOT_PASSWORD=QWERTY

    MYSQLDB_USER=mysql
    MYSQLDB_USER_PASSWORD=QWERTY

    MYSQLDB_HOST=db
    MYSQLDB_DATABASE=lwts-db
    MYSQLDB_LOCAL_PORT=3306
    MYSQLDB_DOCKER_PORT=3306

    TELEGRAM_TOKEN=ENTER YOUR TOKEN
    OPENAI_API_KEY=ENTER YOUR API
   ```
7. Now we can run docker and check is it working. Go to https://www.docker.com and load desktop app. After it
    ```bash
    docker-compose up
    ```

### Deploy to VPS

1. Setup your server. Make a connection via SSH.
2. Update Ubuntu and clone project to root
```bash
sudo apt get update
sudo apt get git
git clone "project-url"
```
3. Go to project folder and create .env file and copy your secrets there
```bash
cd "project-folder"
touch .env
cat .env
nano .env

# add your data
```
4. Install docker-compose and start it
```bash
sudo apt-get update
sudo apt install docker-compose
sudo curl -L https://github.com/docker/compose/releases/download/v2.16.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker compose version
systemctl start docker
```
5. Go to project folder and use to load project
```bash
docker-compose up
```
6. Nice you are done, time to get some coffee!

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE.txt` for more information.

<!-- CONTACT -->
## Contact

Anton Vlezko - [@AntonVlezko](https://t.me/AntonVlezko) - a@vlezko.com

Project Link: [https://github.com/drogonov/lwts](https://github.com/drogonov/lwts)

LinkedIn: [@antonvlezko](https://www.linkedin.com/in/antonvlezko/)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[NodeJS.com]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[NodeJS-url]: https://nodejs.org

[MySQL.com]: https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white
[MySQL-url]: https://www.mysql.com

[Grammy.com]: https://img.shields.io/badge/Telegram-2CA5E0?style=for-the-badge&logo=telegram&logoColor=white
[Grammy-url]: https://grammy.dev

[OpenAI.com]: https://a11ybadges.com/badge?logo=openai
[OpenAI-url]: http://openai.com