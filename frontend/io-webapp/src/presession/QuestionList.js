import React from "react";

import "./Account.css";

const QuestionList = ({ state, dispatch }) => {

  const createHandler = (e) => {
    e.preventDefault();

    (async () => {
      await fetch(process.env.REACT_APP_BACKEND_URL + "/quiz", {
        method: "POST",
        headers: {
          Authorization: state.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          questions: state.designerQuestions
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch({ type: "SET_STAGE_QUIZ_LIST" })
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  };

  return (
    <div className="questionPicker">
      {state.designerQuestions.map((question, index) => {
        return (
          <div
            onClick={(e) =>
              dispatch({ type: "SET_PICKED_QUESTION", payload: index })
            }
            className={state.pickedQuestion === index ? "picked" : "notPicked"}
          >
            {question.content}
          </div>
        );
      })}
      <div
        onClick={(e) => dispatch({ type: "SET_PICKED_QUESTION", payload: -1 })}
        className={state.pickedQuestion === -1 ? "picked" : "notPicked"}
      >
        New Question
      </div>
      <div className="questionListButtonBox">
        <button type="button"
          onClick={(e) => dispatch({ type: "SET_STAGE_QUIZ_LIST" })}
          className="submit"
        >
          Back
        </button>
        <button type="button"
          onClick={(e) => createHandler(e)}
          className="submit"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default QuestionList;
