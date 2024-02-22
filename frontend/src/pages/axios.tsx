"use client";
import { useEffect } from 'react';

import axios from 'axios';

export default function AxiosPage() {
    useEffect(() => {
        connectToApi();
    }, []);

    async function connectToApi() {
        try {
            type TestResponse = {
                message: string;
            }

            const response = await axios.post<TestResponse>(`${process.env.NEXT_PUBLIC_API_REST_URL}/test`, {
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
            <h1>Axios</h1>
        </main>
    );
}
