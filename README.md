# MyLibraryList

MyLibraryList is a full-stack MERN (MongoDB, Express.js, React, Node.js) application designed to help users track, rate, and discuss their favorite anime, books, and games. Users can create personalized lists, add items from various categories, leave ratings and reviews, and explore trending content through a clean, responsive interface.

## Features

- **User Authentication**: Secure registration and login using JWT and bcrypt.
- **Personalized Lists**: Add anime, books, and games to a user’s profile list.
- **Ratings & Reviews**: Rate items on a 1-5 scale and leave comments, visible to all users.
- **Category Support**:
  - Anime (sourced from the Jikan API).
  - Books (assumed external API or manual entry).
  - Games (assumed external API or manual entry).
- **Trending Content**: Displays the top 5 trending items per category on the homepage.
- **Responsive UI**: Built with Material-UI for a modern, mobile-friendly experience.
- **Forum Placeholder**: Basic routing for a future forum feature.

## Tech Stack

**Frontend:** React, React Router, Material-UI, Axios  
**Backend:** Node.js, Express.js, MongoDB (Mongoose), JWT, Bcrypt  
**External APIs:** Jikan (Anime data)  
**Development Tools:** Nodemon (backend dev), npm  

## Usage

### Register or Login:
- Visit `/auth` to sign up or log in.
- A JWT token is stored in localStorage upon success.

### Explore Trending Content:
- Homepage (`/`) shows trending Anime, Books, and Games (top 5 per category).

### View Item Details:
- Click an item (e.g., `/anime/20`) to see details, rate, review, or add to your list.

### Manage Your List:
- Add items via "Add to List" on item pages.
- View your list in `/profile`.

### Rate & Review:
- Submit ratings (1-5) and comments on item detail pages (requires login).

## API Endpoints

### Authentication
- `POST /api/users/register` - Register a user `{ username, email, password }`.
- `POST /api/users/login` - Log in `{ email, password }`, returns JWT.

### User
- `GET /api/users/profile` - Fetch user profile (requires auth).
- `PUT /api/users/profile` - Update profile `{ username, email, bio, profileImage }` (requires auth).
- `DELETE /api/users/profile` - Delete user account (requires auth).
- `POST /api/users/list` - Add item to user’s list `{ externalId, model }` (requires auth).
- `POST /api/users/removeFromList` - Remove item from list `{ itemId }` (requires auth).

### Anime
- `GET /api/anime` - Fetch all anime or search `?query=term`.
- `GET /api/anime/:externalId` - Get anime by externalId.
- `POST /api/anime/rating` - Add rating `{ externalId, rating }` (requires auth).
- `PUT /api/anime/rating` - Update rating `{ externalId, ratingId, rating }` (requires auth).
- `DELETE /api/anime/:externalId/rating/:ratingId` - Delete rating (requires auth).
- `POST /api/anime/review` - Add review `{ externalId, comment }` (requires auth).
- `PUT /api/anime/review` - Update review `{ externalId, reviewId, comment }` (requires auth).
- `DELETE /api/anime/:externalId/review/:reviewId` - Delete review (requires auth).

### Lists
- `POST /api/lists/add` - Add item to a specific list `{ listId, category, itemId }` (requires auth).
- `GET /api/lists` - Get user’s lists (requires auth).
- `DELETE /api/lists/:listId/remove/:itemId` - Remove item from list (requires auth).
- `DELETE /api/lists/:listId` - Delete a list (requires auth).

## Contact

For any inquiries or support, please reach out to:
- **Email**: huangtian1810@gmail.com
- **GitHub**: [AhmedHamza](https://github.com/Huang1810)