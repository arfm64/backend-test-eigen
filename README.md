# BackEnd Test from Eigen

This project is a backend application built using Express.js and TypeScript, and it uses Sequelize for database interaction.

# Installation

This guide explains the steps to install the project on your local machine.

### Installation Steps

###### 1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/arfm64/backend-test-eigen.git
   ```

###### 2. Open the project directory
```bash
cd backend-test-eigen
```

###### 3. Perform the installation using npm
```bash
npm install
```

# Database Configuration

There are two database configurations. The first is located in `config/config.json`, which is used for migrating the database. The second configuration is found in `src/config/database.ts` and is used to run the project.'

###### 1. `src\config\database.ts`:
```bash
Sequelize('eigen-backend-test', 'root', '', {host: 'localhost',dialect: 'mysql'});
```

###### 2. *This configuration is used for migrations `config/config.json`:.
```bash
{
        "username": "root",
        "password": "",
        "database": "eigen-backend-test",
        "host": "localhost",
        "dialect": "mysql"
}
```

### To run migrations and seeders, use the following commands:
```migrate
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

# Running Tests
To run the tests, you can use the command `npm run test`. Then, you can access the test results in the directory `[root]/coverage/lcov-report/index.html`.

# Running the App
You can run the application with the command `npx ts-node src/server.ts`, and then open [http://localhost:3000](http://localhost:3000).

# API Documentation
You can view all API documentation through Swagger at [http://localhost:3000/api-docs/](http://localhost:3000/api-docs/).


