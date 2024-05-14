import { InternetIdentityButton, LogoutButton, useAuth } from "@bundly/ares-react";

export default function Header() {
  const { isAuthenticated, currentIdentity } = useAuth();

  return (
    <header className="bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">Ares Connect</span>
          </a>
        </div>
        <div className="lg:flex lg:gap-x-12"></div>
        <div className="lg:flex lg:flex-1 lg:justify-end">
          {isAuthenticated ? (
            <LogoutButton identity={currentIdentity} />
          ) : (
            <InternetIdentityButton>Login</InternetIdentityButton>
          )}
        </div>
      </nav>
    </header>
  );
}
