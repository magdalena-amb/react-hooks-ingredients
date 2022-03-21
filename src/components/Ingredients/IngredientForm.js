import React, { useState } from "react";

import Card from "../UI/Card";
import "./IngredientForm.css";

const IngredientForm = React.memo((props) => {
  const [inputState, setInputState] = useState({ title: "", amount: "" });

  const submitHandler = (event) => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input
              value={inputState.title}
              type="text"
              id="title"
              onChange={(event) => {
                const newTitle = event.target.value;
                setInputState((prevState) => ({
                  title: newTitle,
                  amount: prevState.amount,
                }));
              }}
            />
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input
              value={inputState.amount}
              type="number"
              id="amount"
              onChange={(event) => {
                const newAmount = event.target.value;
                setInputState((prevState) => ({
                  amount: newAmount,
                  title: prevState.title,
                }));
              }}
            />
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
