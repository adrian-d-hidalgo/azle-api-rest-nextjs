import { BackendActor, backend } from "./backend";

export type RestActors = {
    backend: BackendActor;
};

export const restCanisters = {
    backend,
};
