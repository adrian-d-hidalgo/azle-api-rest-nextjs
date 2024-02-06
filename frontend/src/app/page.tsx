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
      const icHost = process.env.NEXT_PUBLIC_IC_HOST
      const backendCanisterId = process.env.NEXT_PUBLIC_BACKEND_CANISTER_ID;

      const http = axios.create({
        baseURL: `http://${backendCanisterId}.${icHost}`,
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
