# Fullstack dApp (Azle + Express + NextJS + ICP)

This boilerplate is designed to easily build 100% descentralized fullstack web applications on ICP.

## Features

- Build REST API on chain
- Persist SQL database on chain
- Deploy NextJS apps on chain
- Connect frontend to backend using ICP Identities

## Stack

- [Azle](https://demergent-labs.github.io/azle/) - Backend server to serve ExpressJS apps on chain
- [TypeORM](https://typeorm.io/) - ORM currently working with sql.js
- [Ares](https://github.com/bundlydev/ares/) - Frontend and Backend ICP Connector
- [NextJS](https://nextjs.org/) - Frontend Framework
- [Tailwind](https://tailwindcss.com/) - CSS Framework

## Run Locally

Clone the project

```bash
  git clone https://github.com/adrian-d-hidalgo/azle-api-rest-nextjs
```

Go to the project directory

```bash
  cd azle-api-rest-nextjs
```

Install dependencies

```bash
npm install
```

Create a .env file:

```bash
# Create .env file
cp frontend/.env-example frontend/.env
```

Start a ICP local replica:

`dfx start --background --clean`

Get your canister ids:

```bash
# Create canisters
dfx canister create --all

# Get backend canister id
dfx canister id backend

# Get internet-identity canister id
dfx canister id internet-identity
```

Your .env file should look something like this:

```bash
# Replace BACKEND_CANISTER_ID with your backend canister id
NEXT_PUBLIC_API_REST_URL=http://BACKEND_CANISTER_ID.localhost:4943
# Replace INTERNET_IDENTITY_CANISTER_ID with your internet-identity canister id
NEXT_PUBLIC_INTERNET_IDENTITY_URL=http://INTERNET_IDENTITY_CANISTER_ID.localhost:4943
```

Deploy your canisters:

`dfx deploy`

You will receive a result similar to the following (ids could be different four you):

```bash
URLs:
  Frontend canister via browser
    frontend: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai
  Backend canister via Candid interface:
    backend: http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
```

Open your web browser and enter the Frontend URL to view the web application in action.

## Test frontend without deploy to ICP Replica

Comment the next line into `frontend/next.config.mjs` file:

```javascript
// output: "export",
```

Then, navitate to `frontend` folder:

`cd frontend`

Run the following script:

`npm run dev`

## Known Issues

- TypeORM migrations not working
- TypeORM logger not working
- Images can't be uploaded (Azle and Ares issue)
