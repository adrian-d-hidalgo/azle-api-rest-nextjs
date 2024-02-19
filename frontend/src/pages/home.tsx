import { Actors } from "@app/canisters";

import { AuthButton, useActor, useAuth } from "@bundly/ic-react";
import { HttpClient } from "@bundly/ic-http-client";
import { useEffect } from "react";

export default function HomePage() {
    const { isAuthenticated } = useAuth();
    const backend = useActor<Actors>("backend");
    let httpClient = new HttpClient(backend as any);

    useEffect(() => {
        httpClient = new HttpClient(backend as any);
    }, [isAuthenticated]);

    async function testFunction() {
        try {
            const response = await httpClient.post("/test", { hello: "world" }, {
                headers: {
                    "Content-Type": "application/json"
                }
            });

            console.log({ response });
        } catch (error) {
            console.error({ error });
        }
    }

    async function whoAmI() {
        try {
            const response = await httpClient.get("/whoami");

            console.log(response.body);
        } catch (error) {
            console.error({ error });
        }
    }

    return (
        <div>
            <h1>Home Page</h1>
            <AuthButton />
            <div>
                <button onClick={() => whoAmI()}>Who Am I</button>
                <button onClick={() => testFunction()}>Test</button>
            </div>

        </div>
    );
}
