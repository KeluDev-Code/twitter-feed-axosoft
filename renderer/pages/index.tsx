import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import List from "../components/List";
import useTwitter from "../services/twitter";

const IndexPage = () => {
  const [search, setSearch] = useState("");
  const { tweetts, searchHistory, searchTweets, clearStore } = useTwitter();
  const reset = (event: React.FormEvent) => {
    event && event.preventDefault();
    setSearch("");
    clearStore();
  };

  useEffect(() => {
    if (searchHistory) setSearch(searchHistory.slice(-1).pop() || "");
  }, []);

  return (
    <Layout>
      <h1>Twitter feed</h1>
      <form onSubmit={(e) => searchTweets(e, search)}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        ></input>
        <button type="submit">Serach</button>
        <button onClick={reset}>Clear Store</button>
      </form>
      <pre>{searchHistory.toString()}</pre>
      {tweetts && <List items={tweetts} />}
    </Layout>
  );
};

export default IndexPage;
