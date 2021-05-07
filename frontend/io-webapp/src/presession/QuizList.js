import React from "react";

import "./Account.css";

const QuizList = ({ state, dispatch }) => {

  React.useEffect(() => {
    (async () => {
      await fetch("http://localhost:8080/quiz", {
        method: "GET",
        headers: {
          Authorization: state.token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch({ type: "SET_QUIZ_LIST", payload: data.quizzes });
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }, []);

  return (
    <div className="quizList">
      <div className="addQuiz">
        <button
          type="button"
          onClick={() => {
            dispatch({ type: "SET_DESIGNER_QUESTIONS", payload: [] })
            dispatch({ type: "SET_STAGE_DESIGNER" });
          }}
        >
          Add New Quiz
        </button>
      </div>
      {state.quizList.map((quiz) => {
        return (
          <div
            onClick={(e) => {
              dispatch({ type: "SET_DESIGNER_QUESTIONS", payload: quiz.questions })
              dispatch({ type: "SET_STAGE_DESIGNER" });
            }}
            className="quizInList"
          >
            {quiz.id}
          </div>
        );
      })}
    </div>
  );
};

export default QuizList;
