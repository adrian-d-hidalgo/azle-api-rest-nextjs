"use client";

import ares from "@bundly/ares";

import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    connectToApi();
  }, []);

  async function connectToApi() {
    try {
      type TestResponse = {
        message: string;
      }

      // const response = await ares<TestResponse>({
      //   url: `${process.env.NEXT_PUBLIC_API_REST_URL}/test`,
      //   method: "POST",
      //   data: {
      //     message: "Hello, World!"
      //   },
      //   headers: {
      //     "Content-Type": "application/json",
      //   }
      // });

      // const response = await ares.post<TestResponse>(`${process.env.NEXT_PUBLIC_API_REST_URL}/test`, {
      //   message: "Hello, World!"
      // }, {
      //   headers: {
      //     "Content-Type": "application/json",
      //   }
      // });

      const instance = ares.create({
        baseURL: `${process.env.NEXT_PUBLIC_API_REST_URL}`
      });

      const response = await instance.post<TestResponse>("/test", {
        message: "Hello, World!"
      }, {
        headers: {
          "Content-Type": "application/json",
        }
      });

      console.log({ response });
    } catch (error) {
      console.log({ error });
    }
  }

  return (
    <main>
      <h1>Home</h1>
    </main>
  );
}
