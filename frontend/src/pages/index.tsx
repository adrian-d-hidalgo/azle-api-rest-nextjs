import { useAuth, useRestActor } from "@bundly/ares-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

import Header from "@components/header";

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
                            <p className="mt-4 text-sm text-gray-500"><strong>Status:</strong> {isAuthenticated ? "Authenticated" : "Not Authenticated"}</p>
                            <p className="text-gray-700"><strong>Principal ID:</strong> {identity.getPrincipal().toString()}</p>
                        </div>

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold mb-2">REST API Info</h2>
                            <p className="mt-4 text-sm text-gray-500"><strong>Status:</strong> {apiStatus}</p>
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

                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-bold mb-2">Images</h2>
                            <UploadImage />
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
}

function ContactForm(): JSX.Element {
    const backend = useRestActor("backend");
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log('Name:', name);
        console.log('Email:', email);

        try {
            backend.post("/contacts", { name, email }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        } catch (error) {
            console.error({ error });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name:</label>
                <input
                    id="name"
                    type="text"
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                    value={name}
                    onChange={handleNameChange}
                />
            </div>
            <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
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
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Submit
            </button>
        </form>
    );
}

const UploadImage = () => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const file = event.target.files[0];
            setSelectedFile(file);
        }
    };

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (selectedFile) {
            try {
                // Some logic to send the image to the backend
            } catch (error) {
                console.error('Error sending image:', error);
            }
        } else {
            console.log('No image selected.');
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-4">
                <label htmlFor="image" className="block text-gray-700 font-bold mb-2">Select Image:</label>
                <input
                    type="file"
                    id="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
                />
            </div>
            <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
                Upload
            </button>
        </form>
    );
};
