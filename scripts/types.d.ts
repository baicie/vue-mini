import { ProjectManifest } from "@pnpm/types";


export type Manifest = ProjectManifest & {
  buildOptions: {
    name?: string;
    compat?: boolean;
    env?: string;
    formats: ("global" | "cjs" | "esm-bundler" | "esm-browser")[];
  };
};
