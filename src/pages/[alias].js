import client, { q } from "../fauna";
import { useEffect } from "react";
import Router from "next/router";

const Alias = (props) => {
  const { alias } = props.query;

  useEffect(() => {
    console.log(alias);
    client
      .query(q.Get(q.Match(q.Index("aliases-by-name"), alias)))
      .then((ret) => {
        console.log(ret);
        window.location.replace(ret.data.href);
      })
      .catch((err) => {
        Router.push("/");
      });
  });

  return (
    <div>
      <p>Redirecting...</p>
      <style jsx>
        {`
          p {
            font-family: sans-serif;
          }
        `}
      </style>
    </div>
  );
};

Alias.getInitialProps = ({ query }) => {
  return { query };
};

export default Alias;
