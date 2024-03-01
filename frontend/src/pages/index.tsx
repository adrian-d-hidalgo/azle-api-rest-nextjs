import { AuthButton, useRestActor } from "@bundly/ares-react";

export default function IcConnectPage() {
    const backend = useRestActor("backend");

    async function testFunction() {
        try {
            const response = await backend.post("/test", { hello: "world" }, {
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
            const response = await backend.get("/whoami");

            console.log(response);
        } catch (error) {
            console.error({ error });
        }
    }

    return (
        <div>
            <h1>IC Connect</h1>
            <AuthButton />
            <div>
                <button onClick={() => whoAmI()}>Who Am I</button>
                <button onClick={() => testFunction()}>Test</button>
            </div>
        </div>
    );
}
