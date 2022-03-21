import React, { useState } from "react";

import IngredientForm from "./IngredientForm";
import IngredientList from "./IngredientList";
import Search from "./Search";

function Ingredients() {
  const [userIngredients, setUserIngredients] = useState([]);

  function submitHandler(ingr) {
    setUserIngredients((prevIngr) => [
      ...prevIngr,
      { ...ingr, id: Math.random().toString() },
    ]);
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
