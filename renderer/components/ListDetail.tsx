import * as React from "react";

import { Tweet } from "../interfaces";

type ListDetailProps = {
  item: Tweet;
};

const ListDetail = ({ item: tweet }: ListDetailProps) => (
  <div>
    <h3>Detail for {tweet.text}</h3>
    <p>ID: {tweet.id}</p>
    <hr />
  </div>
);

export default ListDetail;
