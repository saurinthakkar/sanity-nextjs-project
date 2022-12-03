import groq from "groq";
import imageUrlBuilder from "@sanity/image-url";
import { PortableText } from "@portabletext/react";
import client from "../../client";
import { useRouter } from "next/router";

function urlFor(source) {
  return imageUrlBuilder(client).image(source);
}

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

const Post = ({ post }) => {
  const router = useRouter();

  //console.log("post", title, name, categories, authorImage, body);
  //console.log("CHD", router, router.query);

  if (router.isFallback) {
    return (
      <div>
        <h1>Loading.........</h1>
      </div>
    );
  } else {
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
      </article>
    );
  }
};

const query = groq`*[_type == "post" && slug.current == $slug][0]{
  title,
  "name": author->name,
  "categories": categories[]->title,
  "authorImage": author->image,
  body
}`;

export async function getStaticPaths() {
  const paths = await client.fetch(
    groq`*[_type == "post" && defined(slug.current)][].slug.current`
  );

  console.log("LOP", paths);

  return {
    paths: paths.map((slug) => ({ params: { slug } })),
    fallback: true,
  };
}

export async function getStaticProps(context) {
  const { slug = "" } = context.params;
  const post = await client.fetch(query, { slug });
  console.log("LOP", post);
  return {
    props: {
      post,
    },
  };
}

export default Post;
