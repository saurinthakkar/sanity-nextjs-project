import Link from "next/link";
import groq from "groq";
import { getClient } from "../lib/sanity.server";

const Index = ({ posts }) => {
  //console.log("YYYYYYYYYYYYYYYYYYYYY", sanityClient);
  return (
    <div>
      <h1>Welcome to blog</h1>
      {posts.length > 0 &&
        posts.map(
          ({ _id, title = " ", slug = "", publishedAt = "" }) =>
            slug && (
              <li key={_id}>
                <Link href="/post/slug" as={`/post/${slug.current}`}>
                  {title}
                </Link>{" "}
                ({new Date(publishedAt).toDateString()})
              </li>
            )
        )}
    </div>
  );
};

export async function getStaticProps({ preview = false }) {
  const query = groq`
  *[_type == "post" && publishedAt < now()] | order(publishedAt desc)`;

  const posts = await getClient().fetch(query);

  return {
    props: {
      posts,
    },
  };
}

export default Index;
