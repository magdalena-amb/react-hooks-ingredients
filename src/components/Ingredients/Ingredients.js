import React, { useState, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  function submitHandler(ingr) {
    fetch(
      "https://react-hooks-ingredient-list-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingr),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        return res.json();
      })
      .then((resData) => {
        setUserIngredients((prevIngr) => [
          ...prevIngr,
          { ...ingr, id: resData.name },
        ]);
      });
  }

  return (
    <div className="App">
      <IngredientForm onFormSubmit={submitHandler} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        {userIngredients.length > 0 && (
          <IngredientList
            ingredients={userIngredients}
            onRemoveItem={() => {}}
          />
        )}
      </section>
    </div>
  );
}

export default Ingredients;
