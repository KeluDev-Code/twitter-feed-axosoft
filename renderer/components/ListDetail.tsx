import * as React from "react";

import { Tweet } from "../interfaces";

type ListDetailProps = {
  item: Tweet;
};

const ListDetail = ({ item: tweet }: ListDetailProps) => (
  <div>
    <h1>Detail for {tweet.text}</h1>
    <p>ID: {tweet.id}</p>
  </div>
);

export default ListDetail;
