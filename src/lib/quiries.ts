// src/lib/queries.ts
import { sanity } from "./sanity";

export async function getHomepage() {
  const homePageQuery = `
    *[_type == "homePage"][0]{
      "createdAt": _createdAt,
      "updatedAt": _updatedAt,
      "documentId": _id,
      "id": _id,
      publishedId,

      heroTitle,
      heroSubtitle,
      description,
      aboutTheBook,
      aboutTheAuthor,

      "heroPicture": {
        "url": heroPicture.asset->url,
        "width": heroPicture.asset->metadata.dimensions.width,
        "height": heroPicture.asset->metadata.dimensions.height
      },

      author_credentials[]{
        description,
        icon
      },

      testimonials[]{
        "id": _key,
        quote,
        reviewerName,
        reviewerTitle,
        rating,
        source
      },

      "uploadedFiles": uploadedFiles[]{
        "id": _key,
        "name": asset->originalFilename,
        "ext": asset->extension,
        "mime": asset->mimeType,
        "size": asset->size / 1024,
        "url": asset->url
      }
    }
  `;

  return sanity.fetch(homePageQuery);
}
