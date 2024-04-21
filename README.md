# _Dark Web Scraper_

#### _A platform that scrapes, analyze and presents data from different paste sites on the dark-web_

## Technologies Used

- _node.js_
- _express_
- _mySQL_
- _sequelize_
- _docker_
- _react_

## Description

In this challenge I developed a scraping, analysis and presentation platform to one of the most hideous places on the dark-web: Paste Sites. These sites contain a lot of criminal activity, ranging from illegal hacking and data theft attempts, through hitmans and other criminal services for sale and all the way to links to child pornography sites.

Note - “paste site” is a site where hackers and cybercriminals have the chance to post whatever textual content they wish to and it will be published there for 1 day.

This site resides on the darknet, and is only accessible through the TOR network that provides the cyber criminals with anonymity.

The project is comprised of six different containers:  
**scraper** - parses through paste sites for new pastes. communicates with the database, ner server and the tor proxy.  
**backend** - retrieves data from the database. communicates with the database and the client.  
**client** - display data. communicates only with the backend.  
**tor proxy** - serves as proxy to tor network .communicates only with the scraper.  
**mysql server** - database. communicates with the scraper and the backend.  
**ner server** - gets entities from text. communicates only with the scraper.

## Setup/Installation Requirements

---

- _Docker Desktop_

_After installing docker you'll need to change every example.env file in every directory to .env file and enter your credentials._  
_Then you'll want to build the client by doing this:_

```
cd client
npm i
npm build
```

_You should have everything you need by now, all that is left to do is to run docker and run this line in the main directory:_

```
docker-compose up
```

And now you can simply go to http://localhost and view the data!

## my features

---

### An omni-search bar to the platform

_You can search by title, content or the author._

### Docker compose

_The whole program is built using Docker compose environment and in doing so achieving secure internal communication and fast and simple configuration._

### Data analysis

_Every paste is analyzed and labeled Named Entity Recognition.NER extracts entities from the text and display them as tags in the dashboard. It's accomplished with an image of stanford NER._

### Scraping framework

_By creating a scraping framework you are now able to scrape from multiply paste site at once without changing your code at all, you simply create a configuration file to a specified site and put it in ./scraper/sites_

## Known Bugs

---

- _Given the nature of paste sites and there content, they might be taken down somewhere in the future. In that case, there will be no new data to display._
