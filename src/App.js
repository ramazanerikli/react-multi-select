import React, { useState, useEffect } from "react";
import "./App.css";
import { FaTimes } from "react-icons/fa";

function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [characters, setCharacters] = useState([]);

  const [selectVisible, setSelectVisible] = useState(false);

  const [searchedItems, setSearchedItems] = useState([]);

  useEffect(() => {
    fetch(`https://rickandmortyapi.com/api/character/?name=${searchQuery}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("data", data);
        setCharacters(data.results);
      });
  }, [searchQuery]);

  const handleChange = (e) => {
    setSelectVisible(true);
    setSearchQuery(e.target.value);
  };

  const addItem = (id) => {
    const item = characters.find((character) => character.id === id);
    const itemExists = searchedItems.includes(item);
    if (itemExists) {
      const updatedSearchedItems = searchedItems.filter(
        (searched) => searched.id !== id
      );
      setSearchedItems(updatedSearchedItems);
    } else {
      setSearchedItems([...searchedItems, item]);
    }
  };

  const removeItem = (id) => {
    const updatedItems = searchedItems.filter((searched) => searched.id !== id);
    setSearchedItems(updatedItems);
  };

  return (
    <div className="App max-w-xl mx-auto mt-5">
      <div className="flex flex-wrap border border-2 border-gray-300 rounded-2xl p-1">
        <div className="flex flex-wrap gap-2 mr-3">
          {searchedItems.map((searched, index) => (
            <span
              key={index}
              className="bg-blue-100 rounded-lg gap-2 px-3 py-2 flex items-center"
            >
              <span>{searched.name}</span>
              <span
                onClick={() => removeItem(searched.id)}
                className="bg-gray-500 flex w-5 h-5 rounded-md flex items-center justify-center"
              >
                <FaTimes color={"#fff"} />
              </span>
            </span>
          ))}
        </div>
        <input
          type="text"
          onChange={handleChange}
          placeholder="Type a name"
          className="w-full bg-white text-gray-900 text-sm rounded-lg outline-none focus:ring-0 focus:border-transparent py-2"
        />
      </div>
      {selectVisible && searchQuery !== "" && (
        <div className="select flex flex-col h-96 overflow-y-scroll border border-gray-300 rounded-lg mt-3">
          {characters?.map((character, index) => {
            const episodes = character.episode.length;

            const name = character.name;
            const searchIndex = name
              .toLowerCase()
              .indexOf(searchQuery.toLowerCase());
            let highlightedName;

            if (searchIndex !== -1) {
              const beforeMatch = name.slice(0, searchIndex);
              const match = name.slice(
                searchIndex,
                searchIndex + searchQuery.length
              );
              const afterMatch = name.slice(searchIndex + searchQuery.length);

              highlightedName = (
                <>
                  {beforeMatch}
                  <b>{match}</b>
                  {afterMatch}
                </>
              );
            } else {
              highlightedName = name;
            }

            const isChecked = searchedItems.some(
              (searched) => searched.id === character.id
            );


            return (
              <div
                key={index}
                className={
                  index === characters.length - 1
                    ? "flex p-3"
                    : "flex p-3 border-b border-gray-300"
                }
              >
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onClick={() => addItem(character.id)}
                    className="w-4 h-4"
                  />
                  <img
                    src={character.image}
                    className="w-16 h-16 rounded-md ml-3"
                  />
                </div>
                <div className="flex flex-col items-start ml-3">
                  <span>{highlightedName}</span>
                  <span>{episodes} Episodes</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
