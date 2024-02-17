import { Actors } from "@app/canisters";
import { useEffect } from "react";

import { useActor } from "@bundly/ic-react";
import { HttpClient } from "@app/utils/http-client";

export default function HomePage() {
    const backend = useActor<Actors>("backend");
    const httpClient = new HttpClient(backend);

    useEffect(() => {
        testFunction();
    }, []);

    async function testFunction() {
        try {
            const response = await httpClient.post("/test", "hello", {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log({ response });
        } catch (error) {
            console.error({ error });
        }
    }

    return (
        <div>
            <h1>Home Page</h1>
        </div>
    );
}
