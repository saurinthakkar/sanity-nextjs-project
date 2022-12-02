import sanityClient from "@sanity/client";

export default sanityClient({
  projectId: "mz0ypwkv", // find this at manage.sanity.io or in your sanity.json
  dataset: "production", // this is from those question during 'sanity init'
  useCdn: true,
  apiVersion: "2022-11-30",
});
