# Cinestream

## Project Overview
Cinestream is a full-stack application designed for streaming movies and TV shows. The application allows users to browse, search, and stream content seamlessly.

## Setup Instructions
1. **Clone the Repository**  
   ```bash
   git clone https://github.com/YounesELOMARI1/my-fullstack-project-cinestream.git
   cd my-fullstack-project-cinestream
   ```

2. **Install Dependencies**  
   - For the backend:
     ```bash
     cd server
     npm install
     ```
   - For the frontend:
     ```bash
     cd client
     npm install
     ```

3. **Environment Variables**  
   Create a `.env` file in the root directory of the server with the following variables:
   ```plaintext
   PORT=5000
   DATABASE_URL=your_database_url
   JWT_SECRET=your_jwt_secret
   ```

4. **Run the Application**  
   - Start the server:
     ```bash
     cd server
     npm start
     ```
   - Start the client:
     ```bash
     cd client
     npm start
     ```

## API Endpoints
| Method | Endpoint                   | Description                     |
| ------ | -------------------------- | ------------------------------- |
| GET    | /api/movies                | Retrieve all movies             |
| GET    | /api/movies/:id            | Retrieve movie by ID            |
| POST   | /api/movies                | Add a new movie                 |
| PUT    | /api/movies/:id            | Update a movie by ID            |
| DELETE | /api/movies/:id            | Delete a movie by ID            |

## Architecture
- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  

The application follows a client-server architecture where the frontend communicates with the backend API.

## Development Guide
- **Testing:** Use Jest and React Testing Library for frontend tests.  
  For backend, use Mocha and Chai.  

- **Linting:** ESLint and Prettier are configured for maintaining code quality.

- **Contributions:**  
  Please create a feature branch and open a pull request for any contributions.  

## License
This project is licensed under the MIT License. See the LICENSE file for more details.