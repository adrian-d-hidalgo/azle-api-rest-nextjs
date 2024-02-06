# Fullstack dApp (Azle + Express + NextJS + ICP)

This template is designed to easily build applications deployed on ICP using Azle + Express for RESTful APIs and Next.js for frontend development.

## Preparation

### Ubuntu dependencies

```bash
sudo apt update
sudo apt install clang
sudo apt install build-essential
sudo apt install libssl-dev
sudo apt install pkg-config
```

### MacOs dependencies

```bash
xcode-select --install
brew install llvm
```

## DFX instalation

```bash
# The dfx command line tools for managing ICP applications
DFX_VERSION=0.16.1 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
```

## Instal Node packages

```bash
npm install
```

## Setup frontend environment variables

Create .env file:

```bash
# Create .env file
cp frontend/.env-example frontend/.env
```

Your .env file should look something like this:

```bash
# Substitute "localhost:4943" with your host address if necessary.
NEXT_PUBLIC_IC_HOST=localhost:4943
# Obtain your canisterId with `dfx canister id backend` and replace it
NEXT_PUBLIC_BACKEND_CANISTER_ID={canisterId}
```

## How to use

```bash
# Start ICP Local Replica
dfx start --background --clean

# Deploy canisters
dfx deploy
```

You will receive a result similar to the following:

```bash
URLs:
  Frontend canister via browser
    frontend: http://127.0.0.1:4943/?canisterId=be2us-64aaa-aaaaa-qaabq-cai
  Backend canister via Candid interface:
    backend: http://127.0.0.1:4943/?canisterId=bd3sg-teaaa-aaaaa-qaaba-cai&id=bkyz2-fmaaa-aaaaa-qaaaq-cai
```

Open your web browser and enter the Frontend URL to view the web application in action.
