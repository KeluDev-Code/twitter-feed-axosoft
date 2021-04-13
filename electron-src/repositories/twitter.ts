import ElectronStore from "electron-store";

const electronStore = new ElectronStore();

const token = "AAAAAAAAAAAAAAAAAAAAAJTKOQEAAAAAtllpeNc92t4jFleF9uRYljkp3Qk%3DhO8QmQhlexpivQz0IiTxOarDl2dyhhs0qUsFbNIpe3yDvAuTlj";

const baseUrlSearch = "https://api.twitter.com/2/tweets/search/recent";
const urlHomeTimeline = "https://api.twitter.com/1.1/statuses/home_timeline.json";

const twitterSearch = (query: string) =>
  new Promise((resolve) => {
    const url = `${baseUrlSearch}?query=${query}`;

    fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        electronStore.set("tweetts", responseData.data || []);
        resolve({ data: responseData.data || [], error: responseData.errors });
      })
      .catch((error) => resolve({ error, data: [] }));
  });

const twitterHomeTimeline = () =>
  new Promise((resolve) => {
    fetch(urlHomeTimeline, {
      method: "GET",
      credentials: "include",
      headers: {
        Authorization: "Bearer " + token,
        Accept: "application/json, text/plain, **",
        "User-Agent": "*",
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((responseData) => {
        resolve({ data: responseData.data || [], error: responseData.errors });
      })
      .catch((error) => resolve({ error, data: [] }));
  });

export { twitterSearch, twitterHomeTimeline };
