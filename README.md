# Job Portal Project

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: You need to have Node.js version 22 installed on your machine. You can download it from [Node.js official website](https://nodejs.org/).
- **pnpm**: You can install pnpm globally using npm:
  ```bash
  npm install -g pnpm
  ```
- **MySQL**: You need to have MySQL installed. You can download it from [MySQL official website](https://www.mysql.com/).

### MySQL Setup

1. **Install MySQL**: Follow the installation instructions for your operating system from the MySQL website.

2. **Create a MySQL user and database**:
   - Open your terminal or command prompt and log in to MySQL:
     ```bash
     mysql -u root -p
     ```
   - Create a new database:
     ```sql
     CREATE DATABASE job_portal_db;
     ```
   - Create a new user (replace `your_username` and `your_password` with your desired username and password):
     ```sql
     CREATE USER 'your_username'@'localhost' IDENTIFIED BY 'your_password';
     ```
   - Grant privileges to the new user on the database:
     ```sql
     GRANT ALL PRIVILEGES ON job_portal_db.* TO 'your_username'@'localhost';
     ```
   - Flush privileges to ensure that the changes take effect:
     ```sql
     FLUSH PRIVILEGES;
     ```
   - Exit MySQL:
     ```sql
     EXIT;
     ```

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/lostintheway/job-portal.git
   cd job-portal
   ```

2. **Install dependencies**:
   Use pnpm to install the project dependencies:
   ```bash
   pnpm install
   ```

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser** and navigate to `http://localhost:3005` to view the application.

## Usage

- You can filter job listings by category and job type.
- Bookmark jobs for later viewing.
- Navigate to job details by clicking on the "View Details" button.

## Contributing

If you want to contribute to this project, please fork the repository and create a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
