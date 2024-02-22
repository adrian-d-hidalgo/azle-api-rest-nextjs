"use client";
import { useEffect } from 'react';

import ares from '@bundly/ares';

export default function AresPage() {
    useEffect(() => {
        connectToApi();
    }, []);

    async function connectToApi() {
        try {
            type TestResponse = {
                message: string;
            }

            const response = await ares.post<TestResponse>(`${process.env.NEXT_PUBLIC_API_REST_URL}/test`, {
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
            <h1>Ares</h1>
        </main>
    );
}
