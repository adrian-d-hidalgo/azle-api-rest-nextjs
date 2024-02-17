import type { AppProps } from 'next/app';

import { Client } from '@bundly/ic-core-js';
import { IcpConnectContextProvider } from '@bundly/ic-react';
import { canisters } from '@app/canisters';

export default function MyApp({ Component, pageProps }: AppProps) {
    const client = Client.create({
        agent: {
            host: process.env.NEXT_PUBLIC_IC_HOST!
        },
        canisters
    });

    return (
        <IcpConnectContextProvider client={client}>
            <Component {...pageProps} />
        </IcpConnectContextProvider>
    )
}
