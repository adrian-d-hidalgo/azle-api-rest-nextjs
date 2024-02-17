import { ActorSubclass } from "@dfinity/agent";

import { Canister } from "@bundly/ic-core-js";

import { idlFactory } from "@app/declarations/backend";
import { _SERVICE } from "@app/declarations/backend/backend.did";

export type BackendActor = ActorSubclass<_SERVICE>;

export const backend: Canister = {
    idlFactory: idlFactory as any,
    // idlFactory,
    configuration: {
        canisterId: process.env.NEXT_PUBLIC_BACKEND_CANISTER_ID!,
    },
};
