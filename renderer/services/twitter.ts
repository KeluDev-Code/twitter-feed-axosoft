import { useEffect, useState } from "react";
import { SearchResult, Tweet } from "../interfaces";

const useTwitter = () => {
  const maxSearch = 5;
  const [tweetts, setTweetts] = useState<Tweet[]>();
  const [searchHistory, setSearchHistory] = useState<string[]>([]);

  const useElectronStore = async (payload?: { key: string; data?: any }) => {
    const res = await global.ipcRenderer.sendSync("useElectronStore", payload);
    return res;
  };
  const twitterHomeTimeline = async () => {
    const response: SearchResult = await global.ipcRenderer.sendSync("twitterHomeTimeline");

    // TODO waiting to have access to the Twitter API to show the timeline
    //setTweetts(response.data || []);

    if (response.error) {
      console.error(JSON.parse(JSON.stringify(response.error)));
    }
  };
  useEffect(() => {
    useElectronStore({ key: "search" }).then((data) => {
      setSearchHistory(data || []);
    });
    twitterHomeTimeline();
  }, []);

  const searchTweets = async (event: React.FormEvent<HTMLFormElement> | null, search: string) => {
    event && event.preventDefault();

    const searchHistoryCopy = [...searchHistory];
    if (!searchHistoryCopy.includes(search)) {
      searchHistoryCopy.push(search);
      if (searchHistoryCopy.length > maxSearch) {
        searchHistoryCopy.shift();
      }
    }

    useElectronStore({ key: "search", data: searchHistoryCopy }).then((data) => {
      console.log("storeSearch", data);
      setSearchHistory(data || []);
    });

    if (search) {
      const response: SearchResult = await global.ipcRenderer.sendSync("twitterSearch", search);

      setTweetts(response.data);
      if (response.error) {
        console.error(JSON.parse(JSON.stringify(response.error)));
      }
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
