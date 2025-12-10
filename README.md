"# PMD-College-backend"

Quick setup for OTP password reset flow:

1. Create a `.env` file in the project root with these values (example):

```
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=1207
DB_NAME=college_db

```

2. Create the database and tables by running the SQL script:

PowerShell:

```
mysql -u root -p < scripts\init_db.sql
```

3. Install dependencies and start the server:

```
npm install
npm run dev
```

4. Endpoints:

- `POST /api/auth/forgot-password` { email }
- `POST /api/auth/verify-otp` { email, otp }
- `POST /api/auth/reset-password` { email, otp, newPassword }

Notes:

- The project uses Gmail SMTP — ensure `EMAIL_PASS` is an app password.
- If you don't want to create a DB immediately, you can still test email sending by running a small script that imports `src/config/mailer.js` and calling `sendOTPEmail` directly.
