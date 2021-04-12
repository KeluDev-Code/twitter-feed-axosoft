import { useEffect, useState } from "react";
import { SearchResult, Tweet } from "../interfaces";

const baseUrlSearch = "https://api.twitter.com/2/tweets/search/recent";
const bearer =
  "Bearer " +
  "AAAAAAAAAAAAAAAAAAAAAJTKOQEAAAAAtllpeNc92t4jFleF9uRYljkp3Qk%3DhO8QmQhlexpivQz0IiTxOarDl2dyhhs0qUsFbNIpe3yDvAuTlj";

const useTwitter = () => {
  const maxSearch = 5;
  const [tweetts, setTweetts] = useState<Tweet[]>();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const useElectronStore = async (payload?: { key: string; data?: any }) => {
    const res = await global.ipcRenderer.sendSync("useElectronStore", payload);
    return res;
  };

  useEffect(() => {
    useElectronStore({ key: "tweetts" }).then((data) => {
      setTweetts(data || []);
    });
    useElectronStore({ key: "search" }).then((data) => {
      setSearchHistory(data || []);
    });
  }, []);

  const searchTweets = async (
    event: React.FormEvent<HTMLFormElement>,
    search: string
  ) => {
    event && event.preventDefault();

    const searchHistoryCopy = [...searchHistory];
    searchHistoryCopy.push(search);
    if (searchHistoryCopy.length > maxSearch) {
      searchHistoryCopy.shift();
    }
    console.log("storeSearch", searchHistoryCopy);

    useElectronStore({ key: "search", data: searchHistoryCopy }).then(
      (data) => {
        console.log("storeSearch", data);
        setSearchHistory(data || []);
      }
    );
    if (search) {
      const url = `${baseUrlSearch}?query=${search}`;

      fetch(url, {
        method: "GET",
        credentials: "include",
        headers: {
          Authorization: bearer,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((responseData: SearchResult) => {
          useElectronStore({
            key: "tweetts",
            data: responseData.data || [],
          }).then((data) => {
            console.table(data);
            setTweetts(data || []);
          });
        })
        .catch((error) => console.error(error));
    }
  };
  const clearStore = async () => {
    await global.ipcRenderer.sendSync("clearElectronStore");
    setTweetts([]);
    setSearchHistory([]);
  };
  return {
    tweetts,
    searchHistory,
    searchTweets,
    clearStore,
  };
};

export default useTwitter;
