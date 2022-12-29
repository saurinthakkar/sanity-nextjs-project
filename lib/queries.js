export const postBySlugQuery = `
*[_type == "post" && slug.current == $slug][0] {
    "slug": slug.current
  }
`;

//*[_type == "post" && defined(slug.current)][].slug.current`;
