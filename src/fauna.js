import faunadb, { query as q } from "faunadb";

const client = new faunadb.Client({ secret: process.env.FAUNA_SECRET });

export { q };
export default client;
