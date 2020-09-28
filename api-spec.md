# Woofer API Spec

## Endpoints:

### Authentication Header:

`Authorization: Bearer jwt.token.here`

- example:
  `Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTY2ZjA4LTI2ZjItNDdiZi1iOGYyLTMwOWJiYzY3NDVjOSIsImlhdCI6MTYwMTI0MzIyNiwiZXhwIjoxNjAxNjAzMjI2fQ.bVDzTCUh4flTjUAV6JMgWQW8HSyKkXAY4J6Ugxd95y0`

Make sure the right content type like `Content-Type: application/json; charset=utf-8` is correctly returned.

### Login User

`POST /api/auth/login`

Example request body:

```JSON
{
	"email": "ana@ex.com",
	"password": "password"
}
```

No authentication required

Required fields: `email`, `password`

##### JSON Objects returned:

```JSON
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImM4N2JkMmMxLTVlMGItNDVlNi04NDMzLTI0MmYyMjY4MzkyNSIsImlhdCI6MTYwMTI0MDQwNiwiZXhwIjoxNjAxNjAwNDA2fQ.SXQk5Nj_lhU_Vb18d265nEDlj3QbCAdCa0IKmFoml-w"
}
```

### Register User

`POST /api/auth/register`

Example request body:

```JSON
{
	"username": "ana",
	"email": "ana@ex.com",
	"password": "password",
	"confirmpassword": "password"
}
```

No authentication required

Required fields: `username`, `email`, `password`, `confirmpassword`

##### JSON Objects returned:

```JSON
{
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYwYTY2ZjA4LTI2ZjItNDdiZi1iOGYyLTMwOWJiYzY3NDVjOSIsImlhdCI6MTYwMTI0MDQ3NCwiZXhwIjoxNjAxNjAwNDc0fQ.oR-lHuKLYNfjx_ICQ4JnNvOgTtfrIVjglxb-ADkrje0"
}
```

### Logout User

`GET /api/auth/logout`

No request body required

Authentication required

No required fields

##### JSON Objects returned:

```JSON
{
    "msg": "LogOut Successfully"
}
```

### Get Logged in User

`GET /api/auth/me`

No request body

Authentication required

No required fields

##### JSON Objects returned:

```JSON
{
    "id": "60a66f08-26f2-47bf-b8f2-309bbc6745c9",
    "username": "ana",
    "email": "ana@ex.com",
    "imageurl": "https://woofer-api.s3.amazonaws.com/60a66f08-26f2-47bf-b8f2-309bbc6745c9/maya-339649207.jpg",
    "createdat": "2020-09-27T21:01:14.130Z",
    "bio": "Hello, I'm Ana",
    "website": "https://ana.com",
    "location": "Los Angeles, Ca",
    "likes": [],
    "notifications": []
}
```

### Mark Notifications as Read

`PUT /api/notifications`

Example request body:

```JSON
[ "53b986df-29d1-496e-8928-9a1e46edade4", "a857d40d-1c69-4348-a472-bb2a97637e5e"]
```

Authentication required

Required Array of woof ID's: `[]`

##### JSON Objects returned:

```JSON
{
    "msg": "Notification marked"
}
```

### Upload image (profile pic)

`PUT /api/users/image`

Request body:

request body is "form-data"
KEY: image
VALUE: pic.jpg (whatever the image is)

Authentication required

Required fields: `VALUE`

##### JSON Objects returned:

```JSON
{
    "imageurl": "https://woofer-api.s3.amazonaws.com/60a66f08-26f2-47bf-b8f2-309bbc6745c9/maya-339649207.jpg",
    "msg": "image uploaded successfully"
}
```

### Update User Profile

`PUT /api/users`

Example request body:

```JSON
{
    "bio": "Hello, I'm Ana",
    "website": "https://www.ana.com",
    "location": "Los Angeles, Ca"
}
```

Authentication required

Accepted fields: `bio`, `website`, `location`

##### JSON Objects returned:

```JSON
{
    "msg": "User Profile Updated Successfully"
}
```

### User Profile Details

`GET /api/users/:username`

No request body

No Authentication required

No required fields

##### JSON Objects returned:

```JSON
{
    "id": "60a66f08-26f2-47bf-b8f2-309bbc6745c9",
    "username": "ana",
    "email": "ana@ex.com",
    "imageurl": "https://woofer-api.s3.amazonaws.com/60a66f08-26f2-47bf-b8f2-309bbc6745c9/maya-339649207.jpg",
    "bio": "Hello, I'm Ana",
    "website": "https://ana.com",
    "location": "Los Angeles, Ca",
    "createdat": "2020-09-27T21:01:14.130Z",
    "woofs": []
}
```

### Get All Woofs

`GET /api/woofs`

No request body

No authentication required

No Required fields

##### JSON Objects returned:

```JSON
[
    {
        "id": "e5389c65-877e-4a5d-9838-4b2127988582",
        "body": "HDAYS YA GED3AN",
        "username": "hady",
        "createdat": "2020-09-20T02:40:17.421Z",
        "imageurl": "https://woofer-api.s3.amazonaws.com/ahmed-761368717.jpg",
        "commentscount": "0",
        "likescount": "1"
    },
    {
        "id": "43e891cc-22da-4f2a-8859-0d0ed82cc8a2",
        "body": "Hello Hello Hello Hello Hello TESTING FROM HADDDDY",
        "username": "hady",
        "createdat": "2020-09-20T02:39:06.975Z",
        "imageurl": "https://woofer-api.s3.amazonaws.com/ahmed-761368717.jpg",
        "commentscount": "0",
        "likescount": "1"
    },
    {
        "id": "81db34e3-eeaf-431a-b092-730353bd72ae",
        "body": "sfsd",
        "username": "ahmed",
        "createdat": "2020-09-08T13:23:37.024Z",
        "imageurl": "https://woofer-api.s3.amazonaws.com/942aaa29-9284-4cf2-b9e2-36bf19657708/ahmed-504591398.jpg",
        "commentscount": "0",
        "likescount": "2"
    }
]
```

### Create New Woof

`POST /api/woofs`

Example request body:

```JSON
{
	"body": "Hello guys welcome me in this awesome woofer app "
}
```

Authentication required

Required fields: `body`

##### JSON Objects returned:

```JSON
{
    "id": "020d8784-b2af-4d17-b3ed-95cf62baeb23",
    "body": "Hello guys welcome me in this awesome woofer app ",
    "username": "ana",
    "createdat": "2020-09-27T21:11:40.247Z",
    "imageurl": "https://woofer-api.s3.amazonaws.com/60a66f08-26f2-47bf-b8f2-309bbc6745c9/maya-339649207.jpg",
    "commentscount": 0,
    "likescount": 0
}
```

### Get Woof by ID

`GET /api/woofs/:woofid`

No request body

No Authentication required

No required fields

##### JSON Objects returned:

```JSON
{
    "id": "020d8784-b2af-4d17-b3ed-95cf62baeb23",
    "body": "Hello guys welcome me in this awesome woofer app ",
    "username": "ana",
    "imageurl": "https://woofer-api.s3.amazonaws.com/60a66f08-26f2-47bf-b8f2-309bbc6745c9/maya-339649207.jpg",
    "createdat": "2020-09-27T21:11:40.247Z",
    "likescount": "0",
    "commentscount": "0",
    "comments": []
}
```

### Delete Woof

`DELETE /api/woofs/:woofid`

No request body

Authentication required

No required fields

##### JSON Objects returned:

```JSON
{
    "msg": "Woof deleted successfully"
}
```

### Add Comment

`POST /api/woofs/:woofid/comment`

Example request body:

```JSON
{
    "body": "Nice post btw, @ali."
}
```

Authentication required

Required fields: `body`

##### JSON Objects returned:

```JSON
{
    "commentid": "59688dbb-e200-4145-a9c6-0f8b7bf92642",
    "body": "Nice post btw, @ali.",
    "createdat": "2020-09-27T21:15:30.145Z",
    "username": "hady",
    "woofid": "020d8784-b2af-4d17-b3ed-95cf62baeb23",
    "imageurl": "https://woofer-api.s3.amazonaws.com/ahmed-761368717.jpg"
}
```

### Delete Comment

`DELETE /api/woofs/:woofid/comment/:commentid`

No request body

Authentication required

No required fields

##### JSON Objects returned:

```JSON
{
    "msg": "Comment deleted successfully"
}
```

### Like Woof

`GET /api/woofs/:woofid/like`

No request body

Authentication required

No required fields

##### JSON Objects returned:

```JSON
{
    "likescount": "1"
}
```

### UnLike Woof

`GET /api/woofs/:woofid/unlike`

No request body

Authentication required

No required fields

##### JSON Objects returned:

```JSON
{
    "likescount": "0"
}
```
