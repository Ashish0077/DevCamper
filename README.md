# DevCamper

DevCamper API written in Node, Express and MongoDB.
<br>
Hosted [HERE](https://dev-camp-api.herokuapp.com/)

![](github_assets/banner.png)

## How to build and run this project
* Clone this repository.
* Execute `npm install`
* Make sure MongoDB is installed your system or setup the MongoDB Atlas online.
* Rename the config/config.env.example --> config.env.pem
* Provide ```NODE_ENV```, ```PORT```, ```TOKEN_ISSUER``` , ```TOKEN_AUDIENCE```, ```MONGO_URI```, ```GEOCODER_API_KEY```, ```JWT_SECRET```, ```SMTP_PORT```, ```SMTP_EMAIL```, ```SMTP_PASSWORD``` in **config/config.env** file
* Execute the following commands for database seeding:
  * For import data ```node seeder -import```
  * For deleting data ```node seeder -destroy```
* Execute `npm start`

 ## Project Directory Structure
```
.
├── config
│   ├── config.env
│   └── db.js
├── controllers
│   ├── auth.js
│   ├── bootcamps.js
│   ├── courses.js
│   ├── reviews.js
│   └── users.js
├── _data
│   ├── bootcamps.json
│   ├── courses.json
│   ├── reviews.json
│   └── users.json
├── github_assets
│   └── banner.png
├── middleware
│   ├── advanceQuery.js
│   ├── asyncHandler.js
│   ├── auth.js
│   ├── error.js
│   └── logger.js
├── models
│   ├── Bootcamp.js
│   ├── Course.js
│   ├── Review.js
│   └── User.js
├── public
│   ├── uploads
│   └── index.html
├── routes
│   ├── auth.js
│   ├── bootcamps.js
│   ├── courses.js
│   ├── reviews.js
│   └── users.js
├── utils
│   ├── errorResponse.js
│   ├── geoCoder.js
│   └── sendEmail.js
├── LICENSE
├── package.json
├── package-lock.json
├── README.md
├── seeder.js
└── server.js
```
## API Specifications
### Bootcamps
- List all bootcamps in the database
   * Pagination
   * Select specific fields in result
   * Limit number of results
   * Filter by fields
- Search bootcamps by radius from zipcode
  * Use a geocoder to get exact location and coords from a single address field
- Get single bootcamp
- Create new bootcamp
  * Authenticated users only
  * Must have the role "publisher" or "admin"
  * Only one bootcamp per publisher (admins can create more)
  * Field validation via Mongoose
- Upload a photo for bootcamp
  * Owner only
  * Photo will be uploaded to local filesystem
- Update bootcamps
  * Owner only
  * Validation on update
- Delete Bootcamp
  * Owner only
- Calculate the average cost of all courses for a bootcamp
- Calculate the average rating from the reviews for a bootcamp

### Courses
- List all courses for bootcamp
- List all courses in general
  * Pagination, filtering, etc
- Get single course
- Create new course
  * Authenticated users only
  * Must have the role "publisher" or "admin"
  * Only the owner or an admin can create a course for a bootcamp
  * Publishers can create multiple courses
- Update course
  * Owner only
- Delete course
  * Owner only
  
### Reviews
- List all reviews for a bootcamp
- List all reviews in general
  * Pagination, filtering, etc
- Get a single review
- Create a review
  * Authenticated users only
  * Must have the role "user" or "admin" (no publishers)
- Update review
  * Owner only
- Delete review
  * Owner only

### Users & Authentication
- Authentication will be ton using JWT/cookies
  * JWT and cookie should expire in 30 days
- User registration
  * Register as a "user" or "publisher"
  * Once registered, a token will be sent along with a cookie (token = xxx)
  * Passwords must be hashed
- User login
  * User can login with email and password
  * Plain text password will compare with stored hashed password
  * Once logged in, a token will be sent along with a cookie (token = xxx)
- User logout
  * Cookie will be sent to set token = none
- Get user
  * Route to get the currently logged in user (via token)
- Password reset (lost password)
  * User can request to reset password
  * A hashed token will be emailed to the users registered email address
  * A put request can be made to the generated url to reset password
  * The token will expire after 10 minutes
- Update user info
  * Authenticated user only
  * Separate route to update password
- User CRUD
  * Admin only
- Users can only be made admin by updating the database field manually

### Security
- Encrypt passwords and reset tokens
- Prevent NoSQL injections
- Add headers for security (helmet)
- Prevent cross site scripting - XSS
- Add a rate limit for requests of 100 requests per 10 minutes
- Protect against http param polution
- Use cors to make API public (for now)

### Documentation [here](https://documenter.getpostman.com/view/10568626/TVzPky3i)
- Version: 1.0.0
- Author: Ashish Arora

### Find this project useful ? :heart:
* Support it by clicking the :star: button on the upper right of this page. :v:

### License
```
MIT License

Copyright (c) 2021 Ashish Arora

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
