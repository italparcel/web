import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ItalParcel — Italian parcel forwarding",
    short_name: "ItalParcel",
    description:
      "Your Italian address for parcels you want forwarded worldwide. Receive, consolidate, and ship from Trento, Italy.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f6",
    theme_color: "#0b0f14",
    lang: "en",
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
