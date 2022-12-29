import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import { getClient } from "../../lib/sanity.server";
import { useRouter } from "next/router";
import Link from "next/link";
import preview from "../api/preview";
function urlFor(source) {
  return imageUrlBuilder(getClient()).image(source);
}

const filterDataToSingleItem = (data, preview) => {
  console.log("KILLLLLL", data, data.length);
  if (!Array.isArray(data)) {
    return data;
  }
  if (data.length === 1) {
    return data[0];
  }
  if (preview) {
    return data.find((item) => item._id.startsWith(`drafts`)) || data[0];
  }

  return data[0];
};

const ptComponents = {
  types: {
    image: ({ value }) => {
      if (!value?.asset?._ref) {
        return null;
      }
      return (
        <img
          alt={value.alt || " "}
          loading="lazy"
          src={urlFor(value).width(320).height(240).fit("max").auto("format")}
        />
      );
    },
  },
};

const Post = ({ preview, post }) => {
  const router = useRouter();

  //console.log("post", title, name, categories, authorImage, body);
  //console.log("CHD", router, router.query);
  console.log("MKIL", post);
  const {
    title = "Missing Title",
    name = "Missing name",
    categories,
    authorImage,
    body = [],
  } = post;
  return (
    <article>
      <h1>{title}</h1>
      <span>By {name}</span>
      {categories && (
        <ul>
          Posted in
          {categories.map((category) => (
            <li key={category}>{category}</li>
          ))}
        </ul>
      )}
      {authorImage && (
        <div>
          <img
            src={urlFor(authorImage).width(50).url()}
            alt={`${name}'s picture`}
          />
        </div>
      )}
      <PortableText value={body} components={ptComponents} />
      {preview && <Link href="/api/exit-preview">Preview Mode activated</Link>}
    </article>
  );
};

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  "name": author->name,
  "categories": categories[]->title,
  "authorImage": author->image,
   body

}
`;

// *[_type == "post" && slug.current == $slug]{
//   title,
//   "name": author->name,
//   "categories": categories[]->title,
//   "authorImage": author->image,
//   body
// }

export async function getStaticPaths() {
  const paths = await getClient().fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  );
  // let newParams = { params: "" };
  // newParams = paths;

  // console.log("LOP", newParams.params);
  //console.log("JIK", paths);

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps({ params, preview = false }) {
  console.log(("SQW", params));
  const { slug = "" } = params;
  const post = await getClient(preview).fetch(query, { slug });
  //if (!post) return { notFound: true };

  console.log("LOLLLLLLLLLLLLLLLP", post, preview);
  //const page = filterDataToSingleItem(post, preview);
  //console.log("LOP", post);
  return {
    props: {
      preview,
      post,
    },
  };
}

export default Post;
