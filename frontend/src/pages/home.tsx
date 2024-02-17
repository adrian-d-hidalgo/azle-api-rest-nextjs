import { Actors } from "@app/canisters";

import { AuthButton, useActor } from "@bundly/ic-react";
import { HttpClient } from "@app/utils/http-client";

export default function HomePage() {
    const backend = useActor<Actors>("backend");
    const httpClient = new HttpClient(backend);

    async function testFunction() {
        try {
            const response = await httpClient.post("/test", { hello: "hello" }, {
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
