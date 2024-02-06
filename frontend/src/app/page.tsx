"use client";

import { useEffect, useState } from "react";
import axios from 'axios';

export default function Home() {
  const [greet, setGreet] = useState<string>("");

  useEffect(() => {
    connectToApi();
  }, []);

  async function connectToApi() {
    try {
      // TODO: Get this from .env, you can run `dfx canister id backend` to get your id
      const canisterId = "bkyz2-fmaaa-aaaaa-qaaaq-cai";

      const http = axios.create({
        baseURL: `http://${canisterId}.localhost:4943`,
        headers: {
          "Content-Type": "application/json",
        }
      });

      const response = await http.get<string>("/");

      setGreet(response.data);
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <main>
      <h1>Home</h1>
      <p>{greet}</p>
    </main>
  );
}
