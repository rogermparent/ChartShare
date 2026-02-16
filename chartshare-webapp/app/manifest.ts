import type { MetadataRoute } from "next";
import { baseManifest } from "chartshare-common/lib/manifest";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    ...baseManifest,
  };
}
