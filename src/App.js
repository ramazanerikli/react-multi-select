import React, { useState, useEffect } from 'react';
import './App.css';
import { FaTimes } from "react-icons/fa";


function App() {

  const [searchQuery, setSearchQuery] = useState('');
  const [characters, setCharacters] = useState([]);

  const [searchResult, setSearchResult] = useState([]);

  const [selectVisible, setSelectVisible] = useState(false);

  const [searchedItems, setSearchedItems] = useState([]);

  useEffect(() => {
    fetch(`https://rickandmortyapi.com/api/character/?name=${searchQuery}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log("data", data)
        setCharacters(data.results)
      })
  }, [searchQuery])

  const handleChange = (e) => {
    setSelectVisible(true);
    setSearchQuery(e.target.value);
    const keyword = searchQuery;
    const filtered = characters.filter(entry => Object.values(entry).some(val => typeof val === "string" && val.includes(keyword)));
    setSearchResult(filtered)
  }

  const addItem = (id) => {
    const item = characters.find(character => character.id === id);
    setSearchedItems([...searchedItems, item])
    console.log("item", item)
  }


  const removeItem = (id) => {
    const updatedItems = searchedItems.filter(searched => searched.id !== id);
    setSearchedItems(updatedItems)
  }

  return (
    <div className="App max-w-3xl mx-auto mt-5">
      <div className="flex border border-2 border-gray-300 rounded-2xl p-1">
      <div className="flex gap-2 mr-3">
        {searchedItems.map((searched, index) => (
          <span key={index} className="bg-blue-100 rounded-lg gap-2 px-3 py-2 flex items-center">
            <span>{searched.name}</span>
            <span onClick={() => removeItem(searched.id)}className="bg-gray-500 flex w-5 h-5 rounded-md flex items-center justify-center"><FaTimes color={"#fff"} /></span>
          </span>
        ))}
      </div>
      <input type="text" onChange={handleChange} placeholder='Type a name' className="bg-white text-gray-900 text-sm rounded-lg outline-none focus:ring-0 focus:border-transparent py-2" />
      </div>
      {selectVisible && searchQuery !== "" && (
        <div className="select flex flex-col">
          {characters.map((character, index) => {
            const episodes = character.episode.length;
            return (
            <div key={index} className="flex py-3">
              <img src={character.image} className="w-16 h-16 rounded-md" />
              <div className="flex flex-col items-start pl-3">
              <span onClick={() => addItem(character.id)}>
              {character.name}
            </span>
            <span>{episodes} Episodes</span>
              </div>
            </div>
            )
            })}
        </div>
      )}
      {characters.map((character, index) => (
        <p key={index} style={{ display: 'none' }}>{character.name}</p>
      ))}
    </div>
  );
}

export default App;
