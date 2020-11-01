## Travelogue

This website is useful for posting your travel pictures. The project is built in MERN stack using NOSQL database MongoDB. Includes RESTful API with Express and NodeJS. It has capabilities to like, comment, post, follow and unfollow people.

## Development

### Backend

```sh
cd Travelogue
```

```sh
npm run dev
```

### Frontend

```sh
cd client
```

```sh
npm install
```

```sh
npm start
```

## API

### Authentication

```sh
/users/signup (for signup)
/users/login  (for Login)
```

### Post

```sh
/post ( to see all the post stored in the application)
/newpost ( to create a new post)
/post/like ( to like a post)
/post/unlike ( to unlike a post)
/post/comment ( to comment on post)
/me/post ( to see your own post)
```

### People

```sh
/profile/:id ( to see your own profile)
/follow ( to follow other users)
/unfollow ( to unfollow users)
```
