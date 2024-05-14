import Header from "@components/header";
import { Identity } from "@dfinity/agent";
import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";

import { useAuth, useRestActor } from "@bundly/ares-react";

type Profile = {
  id: number;
  principal: string;
  username: string;
  bio: string;
};

export default function IcConnectPage(): JSX.Element {
  const { isAuthenticated, currentIdentity } = useAuth();
  const backend = useRestActor("backend", currentIdentity);
  const [apiStatus, setApiStatus] = useState<string>("pending");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    healthCheck();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProfile();
    } else {
      setProfile(null);
    }
  }, [currentIdentity]);

  async function healthCheck() {
    try {
      setLoading(true);
      await backend.get("/health");
      setApiStatus("Ok");
    } catch (error) {
      console.error({ error });
      setApiStatus("Error");
    } finally {
      setLoading(false);
    }
  }

  async function fetchProfile() {
    try {
      setLoading(true);
      const response = await backend.get<Profile | undefined>("/users/me");

      if (!response.data) {
        return;
      }

      console.log({ response });

      setProfile(response.data);
    } catch (error: any) {
      console.error({ error });
    } finally {
      setLoading(false);
    }
  }

  function onProfileCreated(profile: CreateProfileResponse) {
    setProfile(profile);
  }

  return (
    <>
      <Header />
      <main className="p-6">
        <h1 className="text-2xl text-center">Build Fullstack dApps with Azle and Ares</h1>

        {/* Loader */}
        {loading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-50">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-white"></div>
          </div>
        )}

        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">User Info</h2>
              <p className="mt-4 text-sm text-gray-500">
                <strong>Status:</strong> {isAuthenticated ? "Authenticated" : "Not Authenticated"}
              </p>
              <p className="text-gray-700">
                <strong>Principal ID:</strong> {currentIdentity.getPrincipal().toString()}
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
          <h2 className="text-2xl text-center">Interacts with Azle REST API</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">Profile form</h2>
              {!profile ? (
                <ProfileForm
                  identity={currentIdentity}
                  loading={loading}
                  setLoading={setLoading}
                  onProfileCreated={onProfileCreated}
                />
              ) : (
                <p>Profile already created</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-2">Profile data</h2>
              {profile ? (
                <>
                  <p className="text-gray-700">
                    <strong>Username:</strong> {profile?.username}
                  </p>
                  <p className="text-gray-700">
                    <strong>Email:</strong> {profile?.bio}
                  </p>
                </>
              ) : (
                <p>No profile data found, please fill the form first</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

type CreateProfileResponse = {
  id: number;
  principal: string;
  username: string;
  bio: string;
};

type ProfileFormProps = {
  identity: Identity;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  onProfileCreated: (profile: CreateProfileResponse) => void;
};

function ProfileForm(props: ProfileFormProps): JSX.Element {
  const backend = useRestActor("backend", props.identity);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleBioChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBio(e.target.value);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !bio) {
      alert("Please fill all fields");
      return;
    }

    try {
      props.loading && props.setLoading(true);
      const response = await backend.post<CreateProfileResponse>(
        "/users",
        { username, bio },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      props.onProfileCreated(response.data);
    } catch (error: any) {
      alert(`Error creating profile: ${error.data}`);
    } finally {
      props.loading && props.setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="name" className="block text-gray-700 font-bold mb-2">
          Username:
        </label>
        <input
          id="name"
          type="text"
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          value={username}
          onChange={handleUsernameChange}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="email" className="block text-gray-700 font-bold mb-2">
          Bio:
        </label>
        <input
          id="email"
          type="text"
          className="w-full border border-gray-300 rounded-md py-2 px-3 text-gray-700 focus:outline-none focus:border-blue-500"
          value={bio}
          onChange={handleBioChange}
        />
      </div>
      <button
        type="submit"
        disabled={props.loading}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
        Submit
      </button>
    </form>
  );
}
