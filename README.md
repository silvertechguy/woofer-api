# Woofer API (Backend)

Woofer is a twitter-like application allows you to post woofs(tweets), see user profiles, and do the basic CRUD operations.

Check out the deployed site [API - Backend](https://woofer-api.herokuapp.com/)

If you are looking for the frontend repo, [click here](https://github.com/silvertechguy/woofer)
Check out the deployed site [Frontend](https://woofer-official.herokuapp.com/)

## Core Packages

1. express - create restful API server
2. pg - database management
3. jsonwebtoken - authentication
4. redis - fast memory storage to manage sessions using jwt
5. aws-sdk - amazon s3 to storage image

## Features

- Signup / Login
- Notifications 🔔
- View Profile
- Upload Photo
- Edit Profile
- New Woof (tweet)
- Like / UnLike
- Comment
- View Woof

## Watch this video on how to setup locally (up and running) using Docker

Click the YouTube link [here]() or the image down below
[![New Tweet](screenshots/notifications.png)]( "Woofer API Backend Setup")

## Or you can read how to setup locally (up and running) using Docker

- You need to install docker and docker compose

1.  [Instructions here for docker installation](https://docs.docker.com/get-docker)
2.  [Instructions here for docker-compose installation](https://docs.docker.com/compose/install)

### Environmental variables setup

1. Create a .env file at the root directory
2. Copy whatever in the .env.example file in the project and paste it in the .env file you created
3. In order for image upload feature to work you have to fill in these values (you can leave it if you don't care about image uploading)

```javascript
AWS_ACCESS_KEY_ID=<YOUR_ACCESS_KEY_ID>
AWS_SECRET_ACCESS_KEY=<SECRET_ACCESS_KEY>
S3_BUCKET_NAME=<S3_BUCKET_NAME>
```

You can grab AWS_ACCESS_KEY_ID | AWS_SECRET_ACCESS_KEY | S3_BUCKET_NAME here [Amazon S3](https://aws.amazon.com/s3)

## UI

### Home

![Home](screenshots/home.png)

### Notifications

![Notifications](screenshots/notifications.png)

### Profile

![Profile](screenshots/profile.png)

### Edit Profile

![Edit Profile](screenshots/edit-profile.png)

### Woof details

![Woof](screenshots/view_profile.png)

### New Woof

![New Woof](screenshots/new_woof.png)
