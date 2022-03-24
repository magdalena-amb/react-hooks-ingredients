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

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case "SEND":
      return {
        loading: true,
        error: null,
      };
    case "RESPONSE":
      return {
        ...curHttpState,
        loading: false,
      };
    case "ERROR":
      return {
        loading: false,
        error: action.errorData,
      };
    case "CLEAR ERROR":
      return {
        ...curHttpState,
        loading: false,
      };
    default:
      throw new Error("Erron in httpReducer");
  }
};

const Ingredients = () => {
  const [userIngredients, dispatchIngredients] = useReducer(
    ingredientsReducer,
    []
  );

  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false,
    error: null,
  });

  //const [isLoading, setIsLoading] = useState(false);
  //const [error, setError] = useState();

  // useEffect(() => {
  //   console.log("RENDERING INGREDIENTS", userIngredients);
  // }, [userIngredients]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    dispatchIngredients({ type: "SET", ingredients: filteredIngredients });
  }, []);

  function submitHandler(ingr) {
    dispatchHttp({ type: "SEND" });
    fetch(
      "https://react-hooks-ingredient-list-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json",
      {
        method: "POST",
        body: JSON.stringify(ingr),
        headers: { "Content-Type": "application/json" },
      }
    )
      .then((res) => {
        dispatchHttp({ type: "RESPONSE" });

        return res.json();
      })
      .then((resData) => {
        dispatchIngredients({
          type: "ADD",
          ingredient: { id: resData.name, ...ingr },
        });
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", errorData: error.message });
      });
  }

  function removeIngredientHandler(ingredientId) {
    dispatchHttp({ type: "SEND" });
    fetch(
      `https://react-hooks-ingredient-list-default-rtdb.europe-west1.firebasedatabase.app/ingredients/${ingredientId}.json`,
      {
        method: "DELETE",
      }
    )
      .then((res) => {
        dispatchHttp({ type: "RESPONSE" });
        dispatchIngredients({ type: "DELETE", id: ingredientId });
      })
      .catch((error) => {
        dispatchHttp({ type: "ERROR", errorData: error.message });
      });
  }

  function clearError() {
    dispatchHttp({ type: "CLEAR ERROR" });
  }

  return (
    <div className="App">
      {httpState.error && <ErrorModal onClose={clearError}>{httpState.error}</ErrorModal>}
      <IngredientForm onFormSubmit={submitHandler} loading={httpState.loading} />

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
