import { makeSchema, asNexusMethod } from "nexus";

import { DateTimeResolver, JSONObjectResolver } from "graphql-scalars";

export const jsonScalar = asNexusMethod(JSONObjectResolver, "json");


export * from "./Comic";
export * from "./Auth";
