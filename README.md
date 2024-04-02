# Event Management System
This project involves developing a RESTful API to manage and query event data based on a user's geographical location (latitude and longitude points) and a specified date. 

## Getting Started
### 1. Clone the repository
Open cmd in the folder, where you want to clone the repository
```
git clone https://github.com/Balaji1382/event-management-system.git
```

### 2. Requirements
The project is created using node js for the server ,express js as a framework on top of node js and mysql for the database. I use npm as the package manager.
```
npm i
```
Softwares :
<ul type="*">
<li>node (18.17.1)</li>
<li>mysql (8.0.30)</li>
</ul>

Dependencies (given in [package.json](package.json)): 
<ul type="*">
<li>express (4.19.2)</li>
<li>mysql2 (3.9.2)</li>
<li>dotenv (16.4.5)</li>
<li>nodemon (3.1.0)</li>
</ul>

### 3. Configuring the database
The project uses mysql for database as metioned above. You need to create a table named events, in which you'll inject the data from the CSV file in the [data](data) folder. 

#### 3.1 Creating the table and injecting values into it
Open the mysql command line client, go into the database of your choice, create a table named events with the following schema:
```
CREATE TABLE events (
  id INT NOT NULL AUTO_INCREMENT,
  event_name VARCHAR(100) NOT NULL,
  city_name VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  latitude DECIMAL(20,17) NOT NULL,
  longitude DECIMAL(20,17) NOT NULL,
  PRIMARY KEY (id)
);
```
Now to inject the values from an external csv file, you should have *local_infile* variable in mysql to be *ON*
```
SET GLOBAL local_infile = 'ON';
```
Open cmd with admin permissions and enter the following command:
```
mysql local_infile=1 -u <db-user-name> -p
```
Enter the password.
To inject the value from the csv file:
```
LOAD DATA LOCAL INFILE '<absolute-path-to-your-csv-file>' 
INTO TABLE events 
FIELDS TERMINATED BY ',' 
LINES TERMINATED BY '\n'
IGNORE 1 ROWS 
(`event_name`,`city_name`,`date`,`time`,`latitude`,`longitude`);
```

#### 3.2 Modifying the table
Open the mysql command line client, Create a column named *date_time*:
```
ALTER TABLE events ADD COLUMN date_time DATETIME;
```
Set the values for the column:
```
UPDATE events SET date_time = CONCAT(date, ' ', DATE_FORMAT(time, '%H:%i:%s')); 
```
Delete the date and time columns:
```
ALTER TABLE events DROP COLUMN date, DROP COLUMN time;
```
Modify the constraint of date_time column:
```
ALTER TABLE events MODIFY COLUMN date_time DATETIME NOT NULL;
```
Create an index at the column date_time:
```
CREATE INDEX index_date_time ON events(date_time);
```

### 4. Configuring the .env file
You need to create a file named *.env* in the folder where you cloned the repository. Populate the file with the following credentials:
```
DB_NAME = <db-name>
DB_PASSWORD = <db-password>
DB_USER = <db-user-name>
API_KEY_WEATHER = <api-key-weather-finder>
API_kEY_DISTANCE = <api-key-distance-finder>
```

### 5. Run
Open the cmd in the repository folder:
```
nodemon run start
```

## REST API
The REST API has two endpoints to handle requests to create a new Event and to get a list of events from the users.
### Create a new Event
This endpoint handles the requests to create a new event (i.e) create a new record in the events database. 
#### Request
`POST /events`
```
POST http://localhost:10001/events
Content-Type : application/json

{
    "event_name" : "Java Conf 2022",
    "city_name" : "Banglore",
    "date" : "2022-01-09",
    "time" : "09:00:00",
    "latitude" : "12.968413825571696", 
    "longitude" : "77.6013514106023"
}
```

#### Request Body
The handler function expects a request body of type json with the following properties in it:
* event_name
* city_name *(Only alphabets and spaces are allowed)*
* date *(expects the format of YYYY-MM-DD)*
* time *(expects the format of HH:mm:ss)*
* latitude *(should be in the range -90 to +90, inclusive)*
* longitude *(should be in the range -180 to +180, inclusive)*

#### Response
```
HTTP/1.1 201 Created
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 16
ETag: W/"10-BBYhYYsX5JccoIMfL2To9msLzMo"
Date: Sun, 31 Mar 2024 11:45:12 GMT
Connection: close

"Record Created"
```

#### Status Codes
The following status codes are sent with the response object:
* 400 (Bad Request)
    * When the request body is not of type *application/json*
    * When any of the properties in the request body is missing or spelled incorrect
    * When any of the [format](#request-body) of the properties in the request body is violated
* 201 (Created)
    * When a successful record is created in the database

### Get a list of Events
This endpoint handles the requests to search for events. The response value is a paginated list of events, occurring within the next 14 days from the specified date, sorted by the earliest event first in terms of date and time of the events.
#### Request
`GET /events/find`
```
GET http://localhost:10001/events/find?latitude=40.7128&longitude=-74.0060&date=2022-01-09
```

#### Request Query Parameters
The handler function expects the following query string parameters to be present in the query:
* latitude *(should be in the range of -90 to 90, inclusive)*
* longitude *(should be in the range of -180 to 180, inclusive)*
* date *(expects the format of YYYY-MM-DD)*

#### Response
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 201
ETag: W/"c9-20kXdhINmoLQGSSnFBeSAE7rDbo"
Date: Sun, 31 Mar 2024 13:53:38 GMT
Connection: close

[
  {
    "events": [
      {
        "event_name": "Java Conf 2022",
        "city_name": "Banglore",
        "date": "2022-01-09",
        "weather": "Sunny, 18C",
        "distance_km": "13368.610867870244"
      }
    ],
    "page": 1,
    "pageSize": 10,
    "totalEvents": 1,
    "totalPages": 1
  }
]
```

#### Status Codes
The following status codes are sent with the response object:
* 400 (Bad Request)
    * When any of the parameters in the request query is missing or spelled incorrect
    * When any of the [format](#request-query-parameters) of the parameters in the request query is violated
* 200 (Success)
    * When the server sucessfully retrieved a list of events

## Design Choices
* I chose MySQL as the database because the data was already in a concise format in a CSV file. MySQL also ensures that the data remains consistent, maintaining the formats of dates and times throughout the database.
* I created a column (*date_time*) combining *date* and *time* columns of the table and returned the search list of events sorted by the date and time.
* I also created an index on the column *date_time*, as the search sorts the records using the *date_time* column.
* I added a default timeout of 10 seconds for the external APIs to return the result.
* Whenever there is an error or the response status of the external API for a request, the corresponding value will be empty strings (i.e.) *distance_km* or *weather* will be equal to "".
* I used javascript promises to send out (2 * n) requests to respective external API concurrently, where n is the length of the list retuned by the database, during a search request.



