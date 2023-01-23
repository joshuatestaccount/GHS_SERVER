Create a .env and .gitignore file in source (src) folder
after you create a .env file run in the terminal

# THIS WILL DOWNLOAD ALL THE DEPENDENCIES THAT THE FOLDER IS USING

npm i

add .env file in .gitignore
in the .env file create a variable:

# DATABASE CONNECTION

DATABASE_URL = ""

# DBCON Example

DATABASE_URL="postgres://<username>:<password>@localhost:5432/<your_database_name>"

# NODEMAILER SETUP 
# THERE IS ALSO A TUTORIAL HOW TO SETUP NODEMAILER IN SRC/API/HELPERS/EMAIL.TS

GMAIL_ACCOUNT = "<GMAIL_ACCOUNT>"
GMAIL_CLIENTID = "<GMAIL_CLIENTID>"
GMAIL_CLIENTSECRET ="<GMAIL_CLIENTSECRET>"
GMAIL_REFRESHTOKEN = "<GMAIL_REFRESHTOKEN>"
GMAIL_ACCESSTOKEN = "<GMAIL_ACCESSTOKEN>"

# RUN THE SERVER

npm run dev

In case you got an error message. try to delete node_modules and try npm i again.

# SETUP THE GOOGLE

GOOGLE_KEY = "<GOOGLE_KEY>"
GOOGLE_PROJECT ="<GOOGLE_PROJECT>"
GOOGLE_CLIENT_EMAIL="<GOOGLE_CLIENT_EMAIL>"
GOOGLE_PRIVATE_KEY="<GOOGLE_PRIVATE_KEY>"
GOOGLE_BUCKET_NAME="<GOOGLE_BUCKET_NAME>"
