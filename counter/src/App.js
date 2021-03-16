import {
  RecoilRoot,
  useRecoilState,
  atom,
  selector,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { useState } from "react";

function App() {
  return (
    <RecoilRoot>
      <ItemCreator></ItemCreator>
      <ToList></ToList>
    </RecoilRoot>
  );
}

let idItem = 0;

const allListState = atom({ key: "allListState", default: [] });

function ItemCreator() {
  const [text, setText] = useState("");
  const setNewAll = useSetRecoilState(allListState);
  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const onClickItem = () => {
    setNewAll((allListState) => [
      ...allListState,
      { id: idItem++, text, isCompleted: false },
    ]);
    setText("");
  };
  return (
    <div>
      <input value={text} onChange={onChangeText}></input>
      <button onClick={onClickItem}>Agregar</button>
    </div>
  );
}

function ToList() {
  const todos = useRecoilValue(allListState);
  return (
    <div>
      {todos.map((item) => (
        <TodoItem key={item.id} {...item}></TodoItem>
      ))}
    </div>
  );
}

function changeItemList(id, itemChange, changedItem) {
  const index = itemChange.findIndex((item) => item.id === id);
  return [
    ...itemChange.slice(0, index),
    changedItem,
    ...itemChange.slice(index + 1, itemChange.length),
  ];
}

function TodoItem({ id, text, isCompleted }) {
  const [changeItem, setChangeItem] = useRecoilState(allListState);

  const onChangeItem = (e) => {
    const text = e.target.value;
    const newChange = { id, text, isCompleted };
    setChangeItem(changeItemList(id, changeItem, newChange));
  };
  return (
    <div>
      <input value={text} onChange={onChangeItem}></input>
      <input type="checkbox" checked={isCompleted}></input>
      <button>x</button>
    </div>
  );
}

export default App;
