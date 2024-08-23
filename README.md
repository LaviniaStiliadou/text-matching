# Text Matching Server


## Docker Setup

* Clone the repository:
```
git clone https://github.com/UST-QuAntiL/text-matcher-server.git
```

* Update your OpenAI API key in the .env file.

* Start the container using the [docker-compose file](docker-compose.yml):
```
docker-compose pull
docker-compose up
```

Now the text-matching-server is available on http://localhost:1985/.

## Local Setup
The backend uses [node](https://nodejs.org/en) version 16.20.2.
* Install the required packages with:
```
npm install
```

* To start the backend run:
```
node server.js
```

Now the text-matching-server is available on http://localhost:1985/.


## Haftungsausschluss

Dies ist ein Forschungsprototyp.
Die Haftung für entgangenen Gewinn, Produktionsausfall, Betriebsunterbrechung, entgangene Nutzungen, Verlust von Daten und Informationen, Finanzierungsaufwendungen sowie sonstige Vermögens- und Folgeschäden ist, außer in Fällen von grober Fahrlässigkeit, Vorsatz und Personenschäden, ausgeschlossen.

## Disclaimer of Warranty

Unless required by applicable law or agreed to in writing, Licensor provides the Work (and each Contributor provides its Contributions) on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied, including, without limitation, any warranties or conditions of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A PARTICULAR PURPOSE.
You are solely responsible for determining the appropriateness of using or redistributing the Work and assume any risks associated with Your exercise of permissions under this License.

