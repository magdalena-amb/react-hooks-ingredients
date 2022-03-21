import React, { useState, useEffect, useRef } from "react";

import Card from "../UI/Card";
import "./Search.css";

const Search = React.memo((props) => {
  const { onLoadIngredients } = props;
  const [enteredFilter, setEnteredFilter] = useState("");
  const inputRef = useRef();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (enteredFilter === inputRef.current.value) {
        const query =
          enteredFilter.length === 0
            ? ""
            : `?orderBy="title"&equalTo="${enteredFilter.toLowerCase()}"`;
        async function fetchData() {
          const response = await fetch(
            `https://react-hooks-ingredient-list-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json${query}`
          );
          return await response.json();
        }

        fetchData().then((resData) => {
          const transformedIngredients = [];

          for (let key in resData) {
            transformedIngredients.push({
              id: key,
              title: resData[key].title,
              amount: resData[key].amount,
            });
          }

          onLoadIngredients(transformedIngredients);
        });
      }
    }, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [enteredFilter, onLoadIngredients, inputRef]);

  function filterChangeHandler(event) {
    setEnteredFilter(event.target.value);
  }

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input
            type="text"
            ref={inputRef}
            value={enteredFilter}
            onChange={filterChangeHandler}
          />
        </div>
      </Card>
    </section>
  );
});

export default Search;
