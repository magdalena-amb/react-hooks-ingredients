import React, { useState, useEffect } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  useEffect(() => {
     async function fetchData () {
      const response = await fetch(
        "https://react-hooks-ingredient-list-default-rtdb.europe-west1.firebasedatabase.app/ingredients.json"
      )
      return await response.json();
     }

     fetchData()
     .then(resData => {

      const transformedIngredients = [];

      for (let key in resData) {
        transformedIngredients.push({
          id: key,
          title: resData[key].title,
          amount: resData[key].amount,
        });
      }
      setUserIngredients(transformedIngredients);
     })
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
        console.log(resData);
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
        <Search />
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
