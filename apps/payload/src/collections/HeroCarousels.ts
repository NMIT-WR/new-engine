import { CollectionConfig } from "payload";

import { adminGroups, collectionLabels, fieldLabels } from "../lib/constants/labels";
import { requireAuth } from "../lib/access/requireAuth";

export const HeroCarousels: CollectionConfig = {
  slug: "hero-carousels",
  access: {
    read: requireAuth,
  },
  labels: collectionLabels.heroCarousels,
  admin: {
    useAsTitle: "heading",
    defaultColumns: ["heading", "subheading", "image"],
    group: adminGroups.content,
  },
  fields: [
    {
      name: "image",
      label: fieldLabels.image,
      type: "upload",
      relationTo: "media",
      required: true,
    },
    {
      name: "heading",
      label: fieldLabels.heading,
      type: "text",
      required: false,
      localized: true,
    },
    {
      name: "subheading",
      label: fieldLabels.subheading,
      type: "text",
      required: false,
      localized: true,
    },
    {
      name: "button",
      label: fieldLabels.buttonText,
      type: "text",
      required: false,
      localized: true,
    },
    {
      name: "buttonHref",
      label: fieldLabels.buttonUrl,
      type: "text",
      required: false,
    },
  ],
};
