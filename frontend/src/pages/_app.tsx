import type { AppProps } from 'next/app';

import { Client, InternetIdentity } from '@bundly/ic-core-js';
import { IcpConnectContextProvider } from '@bundly/ic-react';

import { restCanisters } from '@app/canisters';

export default function MyApp({ Component, pageProps }: AppProps) {
    const client = Client.create({
        agent: {
            host: process.env.NEXT_PUBLIC_IC_HOST!
        },
        restCanisters,
        providers: [
            new InternetIdentity({
                providerUrl: process.env.NEXT_PUBLIC_INTERNET_IDENTITY_URL!
            })
        ]
    });

    return (
        <IcpConnectContextProvider client={client}>
            <Component {...pageProps} />
        </IcpConnectContextProvider>
    )
}
