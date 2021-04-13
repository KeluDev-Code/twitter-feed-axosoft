import React from "react";
import { Tweet } from "../interfaces";
import ListDetail from "./ListDetail";

type Props = {
  items: Tweet[];
};

const List = ({ items }: Props) => (
  <ul>
    {items.map((item) => (
      <ListDetail key={item.id} item={item}></ListDetail>
    ))}
  </ul>
);

export default List;
