import React, { useState, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  function submitHandler(ingr) {
    setIsLoading(true);
    fetch(
      "https://react-hooks-ingredient-list-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingr),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        setIsLoading(false);

        return res.json();
      })
      .then((resData) => {
        setUserIngredients((prevIngr) => [
          ...prevIngr,
          { ...ingr, id: resData.name },
        ]);
      });
  }

  function removeIngredientHandler(ingredientId) {
    setIsLoading(true);
    fetch(
      `https://react-hooks-ingredient-list-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    ).then((res) => {
      setIsLoading(false);
      setUserIngredients((prevIngr) => {
        prevIngr.filter((ingr) => ingr.id !== ingredientId);
      });
    });
  }

  return (
    <div className="App">
      <IngredientForm onFormSubmit={submitHandler} loading={isLoading} />

      <section>
        <Search onLoadIngredients={filteredIngredientsHandler} />
        <IngredientList
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler}
        />
      </section>
    </div>
  );
}

export default Ingredients;
