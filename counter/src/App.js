import {
  RecoilRoot,
  useRecoilState,
  atom,
  selector,
  useRecoilValue,
  useSetRecoilState,
} from "recoil";
import { Suspense, useState } from "react";
import "./App.css";

function App() {
  return (
    <RecoilRoot>
      <Suspense fallback={<h1>Cargando...</h1>}>
        <Filter></Filter>
        <ToStats></ToStats>
        <ItemCreator></ItemCreator>
        <ToList></ToList>
      </Suspense>
    </RecoilRoot>
  );
}

let idItem = 0;

const allListState = atom({ key: "allListState", default: [] });

const filterState = atom({ key: "filterState", default: "all" });

const filterSelector = selector({
  key: "filterSelector",
  get: ({ get }) => {
    const list = get(allListState);
    const filter = get(filterState);
    switch (filter) {
      case "done":
        return list.filter((item) => item.isCompleted);
      case "notDone":
        return list.filter((item) => !item.isCompleted);

      default:
        return list;
    }
  },
});

const toStatsSelector = selector({
  key: "toStatsSelector",
  get: ({ get }) => {
    const list = get(allListState);
    const toDo = list.filter((item) => !item.isCompleted).length;
    const done = list.filter((item) => item.isCompleted).length;
    const percentage =
      list.length === 0 ? 0 : ((done / list.length) * 100).toFixed(0);
    const data = {
      total: list.length,
      toDo,
      done,
      percentage,
    };
    return data;
  },
});

function ItemCreator() {
  const [text, setText] = useState("");
  const setNewAll = useSetRecoilState(allListState);
  const onChangeText = (event) => {
    setText(event.target.value);
  };

  const onClickItem = () => {
    const newData = { id: idItem++, text, isCompleted: false };
    setNewAll((allListState) => [...allListState, newData]);

    setText("");
  };
  return (
    <div className="input-creator">
      <input value={text} onChange={onChangeText}></input>
      <button onClick={onClickItem}>Agregar</button>
    </div>
  );
}

function ToList() {
  const todos = useRecoilValue(filterSelector);
  return (
    <ul>
      {todos.map((item) => (
        <TodoItem key={item.id} {...item}></TodoItem>
      ))}
    </ul>
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

function deleteItem(id, item) {
  const index = item.findIndex((item) => item.id === id);
  return [...item.slice(0, index), ...item.slice(index + 1, item.length)];
}

function TodoItem({ id, text, isCompleted }) {
  const [changeItem, setChangeItem] = useRecoilState(allListState);

  const onChangeItem = (e) => {
    const text = e.target.value;
    const newChange = { id, text, isCompleted };
    setChangeItem(changeItemList(id, changeItem, newChange));
  };

  const oncChangeCheck = () => {
    const item = { id, text, isCompleted: !isCompleted };
    setChangeItem(changeItemList(id, changeItem, item));
  };

  const onClickDelete = () => {
    setChangeItem(deleteItem(id, changeItem));
  };
  return (
    <li>
      <input value={text} onChange={onChangeItem}></input>
      <input
        type="checkbox"
        checked={isCompleted}
        onChange={oncChangeCheck}
      ></input>
      <button onClick={onClickDelete}>Eliminar</button>
    </li>
  );
}

function Filter() {
  const [filterItem, setFilterItem] = useRecoilState(filterState);
  const onChangeFilter = (e) => {
    const { value } = e.target;
    setFilterItem(value);
  };
  return (
    <header>
      <p>Tareas</p>
      <select value={filterItem} onChange={onChangeFilter}>
        <option value="all">Todos</option>
        <option value="done">Realizados</option>
        <option value="notDone">Incompletos</option>
      </select>
    </header>
  );
}

function ToStats() {
  const { total, toDo, done, percentage } = useRecoilValue(toStatsSelector);
  return (
    <div className="tareas">
      <span>Tareas totales {total}</span>
      <br />
      <span>Tareas por hacer {toDo}</span>
      <br />
      <span>Tareas realizadas {done}</span>
      <br />
      <span>Porcentaje {percentage} %</span>
    </div>
  );
}

export default App;
