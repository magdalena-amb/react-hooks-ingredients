import React, { useEffect, useReducer, useState, useCallback } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import ErrorModal from "../UI/ErrorModal";
import Search from "./Search";

const ingredientsReducer = (currentIngredients, action) => {
  switch (action.type) {
    case "SET":
      return action.ingredients;
    case "ADD":
      return [...currentIngredients, action.ingredient];
    case "DELETE":
      return currentIngredients.filter((ing) => ing.id !== action.id);
    default:
      throw new Error("Error in ingredientsReducer");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatchIngredients] = useReducer(
    ingredientsReducer,
    []
  );

  //const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  useEffect(() => {
    console.log("RENDERING INGREDIENTS", userIngredients);
  }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatchIngredients({ type: "SET", ingredients: filteredIngredients });
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
        dispatchIngredients({
          type: "ADD",
          ingredient: { id: resData.name, ...ingr },
        });
      });
  }

  function removeIngredientHandler(ingredientId) {
    setIsLoading(true);
    fetch(
      `https://react-hooks-ingredient-list-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    ).then(res => {
        setIsLoading(false);
        dispatchIngredients({type: 'DELETE', id : ingredientId})
    })
        // console.log(userIngredients);
      .catch((error) => {
        setError(error.message);
      });
  }

  function clearError () {
    setError(null);
    setIsLoading(false);
  }

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
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
};

export default Ingredients;
