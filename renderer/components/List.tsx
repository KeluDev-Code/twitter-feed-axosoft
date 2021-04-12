import React from "react";
import { Tweet } from "../interfaces";

type Props = {
  items: Tweet[];
};

const List = ({ items }: Props) => (
  <ul>
    {items.map((item) => (
      <li key={item.id}>
        {item.id}: {item.text}
      </li>
    ))}
  </ul>
);

export default List;
