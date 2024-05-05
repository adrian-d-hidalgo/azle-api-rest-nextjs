import Header from "@components/header";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { useAuth, useRestActor } from "@bundly/ares-react";

export default function IcConnectPage(): JSX.Element {
  const backend = useRestActor("backend");
  const { isAuthenticated, identity } = useAuth();
  const [apiStatus, setApiStatus] = useState<string>("pending");

  useEffect(() => {
    healthCheck();
  }, []);

  async function healthCheck() {
    try {
      await backend.get("/health");
      setApiStatus("Ok");
    } catch (error) {
      console.error({ error });
      setApiStatus("Error");
    }
  }

  return (
    <>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl text-center">Build Fullstack dApps with Azle and Ares</h1>

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">User Info</h2>
              <p className="mt-4 text-sm text-gray-500">
                <strong>Status:</strong> {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </p>
              <p className="text-gray-700">
                <strong>Principal ID:</strong> {identity.getPrincipal().toString()}
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">REST API Info</h2>
              <p className="mt-4 text-sm text-gray-500">
                <strong>Status:</strong> {apiStatus}
              </p>
              <p className="text-gray-700"></p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl text-center">Send multiple data types</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">JSON Data</h2>
              <ContactForm />
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">{/* More connections */}</div>
          </div>
        </div>
      </main>
    </>
  );
}

type CreateContactsResponse = {
  name: string;
  email: string;
};

function ContactForm(): JSX.Element {
  const backend = useRestActor("backend");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Name:", name);
    console.log("Email:", email);

    try {
      const response = await backend.post<CreateContactsResponse>(
        "/contacts",
        { name, email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log(response.data.email, response.data.name);
    } catch (error) {
      console.error({ error });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Name:
        </label>
        <input
          id="name"
          type="text"
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          value={name}
          onChange={handleNameChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
          Email:
        </label>
        <input
          id="email"
          type="text"
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          value={email}
          onChange={handleEmailChange}
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Submit
      </button>
    </form>
  );
}
