import Head from "next/head";
import { Component } from "react";
import client, { q } from "../fauna";
import validUrl from "valid-url";

class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      urlValue: "",
      aliasValue: "",
      feedback: "",
      feedbackColor: "#000000",
    };

    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    if (validUrl.isUri(this.state.urlValue) && this.state.aliasValue) {
      this.setState({
        feedback: `Loading...`,
        feedbackColor: "black",
      });
      client
        .query(
          q.Create(q.Collection("aliases"), {
            data: { name: this.state.aliasValue, href: this.state.urlValue },
          })
        )
        .then((ret) => {
          console.log(ret);
          this.setState({
            feedback: `URL created successfully! Check it out <a href=${`/${ret.data.name}`}>https://👋👉.ml/${
              ret.data.name
            }</a>`,
            feedbackColor: "green",
          });
        })
        .catch((err) => {
          this.setState({
            feedback: "That alias is already in use. Please pick another one",
            feedbackColor: "red",
          });
        });
    } else if (!this.state.aliasValue) {
      this.setState({
        feedback: "Your alias is empty. Please try again",
        feedbackColor: "red",
      });
    } else {
      this.setState({
        feedback: "Your URL looks invalid. Please try again",
        feedbackColor: "red",
      });
    }
  }

  onChange(e, type) {
    if (type === "url") {
      this.setState({
        urlValue: e.target.value,
      });
    } else if (type === "alias") {
      this.setState({
        aliasValue: e.target.value,
      });
    }
  }

  render() {
    return (
      <div className="container">
        <Head>
          <title>👋👉</title>
          <meta
            name="description"
            content="👋👉 is a delightfully
            simple URL shortener for emoji lovers."
          />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main>
          <h1>👋👉</h1>
          <p>
            <a href="https://👋👉.ml">https://👋👉.ml</a> is a delightfully
            simple URL shortener for emoji lovers. It's free and{" "}
            <a href="https://github.com/kartiknair/moji">open-source</a> and
            leverages FaunaDB &amp; Next.js for fast and reliable URLs.
          </p>
          <form onSubmit={this.handleSubmit}>
            <p>
              <label htmlFor="url">Your long URL:</label>
              <input
                type="text"
                placeholder="https://realylongurl.com/is-really-long"
                name="url"
                onChange={(e) => this.onChange(e, "url")}
              ></input>
            </p>

            <p>
              <label htmlFor="alias">Your alias:</label>
              <input
                type="text"
                placeholder="https://👋👉.ml/<THIS_PART>"
                name="alias"
                onChange={(e) => this.onChange(e, "alias")}
              ></input>
            </p>

            <button type="submit">Create</button>
          </form>
          <p
            className="feedback"
            dangerouslySetInnerHTML={{ __html: this.state.feedback }}
          ></p>
        </main>

        <style jsx global>{`
          * {
            box-sizing: border-box;
          }

          html,
          body {
            padding: 0;
            margin: 0;
            font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
              Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
              sans-serif;
            line-height: 1.5;
          }

          :root {
            font-size: 1rem;
          }

          @media (min-width: 1200px) {
            :root {
              font-size: 1.1rem;
            }
          }

          @media (min-width: 1800px) {
            :root {
              font-size: 1.4rem;
            }
          }

          @media (min-width: 2600px) {
            :root {
              font-size: 2rem;
            }
          }

          @media (min-width: 3000px) {
            :root {
              font-size: 3.5rem;
            }
          }

          main {
            width: 100%;
            height: 100%;
            padding: 5rem 30rem 0rem 10rem;
          }

          input[type="text"] {
            width: 25rem;
            display: block;
            padding: 0.6rem;
            border: 1px solid #999;
            border-radius: 0.2rem;
            margin: 0.5rem 0;
            font-family: inherit;
            font-size: 0.75rem;
            transition: all 200ms ease;
          }

          button {
            font-family: inherit;
            font-size: 0.8rem;
            padding: 0.5rem 1.5rem;
            background: #ffffff;
            border: 1px solid #999;
            border-radius: 0.2rem;
            margin: 0.5rem 0;
            transition: all 200ms ease;
          }

          button:hover {
            border: 1px solid #000;
            cursor: pointer;
          }

          button:active {
            background: #eaeaea;
          }

          a {
            color: blue;
            text-decoration: none;
            border-bottom: 1px solid blue;
          }

          .feedback {
            font-size: 0.8rem;
            color: ${this.state.feedbackColor};
          }

          input[type="text"]:focus,
          input[type="text"]:active,
          button:focus {
            outline: none;
            border: 1px solid #000;
          }

          @media (max-width: 1024px) {
            main {
              padding: 5rem 15rem 0rem 5rem;
            }
          }

          @media (max-width: 635px) {
            main {
              padding: 3rem 2.5rem 0rem 2.5rem;
            }

            input[type="text"] {
              width: 90%;
            }
          }
        `}</style>
      </div>
    );
  }
}

export default Home;
