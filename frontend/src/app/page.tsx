"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [greet, setGreet] = useState();

  useEffect(() => {
    connectToApi();
  }, []);

  async function connectToApi() {
    try {
      const response = await fetch("http://bkyz2-fmaaa-aaaaa-qaaaq-cai.localhost:4943", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        }
      });
      console.log({ response });
      // setGreet(response);
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
