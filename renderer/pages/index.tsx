import React, { useState } from "react";
import Layout from "../components/Layout";
import List from "../components/List";
import useTwitter from "../services/twitter";

const IndexPage = () => {
  const [search, setSearch] = useState("");
  const [searchHistoryVisible, setSearchHistoryVisible] = useState(false);
  const { tweetts, searchHistory, searchTweets, clearStore } = useTwitter();
  const reset = (event: React.FormEvent) => {
    event && event.preventDefault();
    setSearch("");
    clearStore();
  };
  const handleClickSearchHistory = (item: string) => {
    setSearch(item);
    searchTweets(null, item);
  };

  return (
    <Layout>
      <h1>Twitter feed</h1>
      <form onSubmit={(e) => searchTweets(e, search)}>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onFocus={() => setSearchHistoryVisible(true)}
          onBlur={() => setTimeout(() => setSearchHistoryVisible(false), 100)}
        ></input>
        <button type="submit">Serach</button>
        <button onClick={reset}>Clear Store</button>
      </form>
      <p>
        {searchHistoryVisible &&
          searchHistory.map((item, i) => (
            <span>
              <a key={i} onClick={() => handleClickSearchHistory(item)} href="#">
                {item};
              </a>
              &nbsp;&nbsp;
            </span>
          ))}
      </p>
      {tweetts && <List items={tweetts} />}
    </Layout>
  );
};

export default IndexPage;
