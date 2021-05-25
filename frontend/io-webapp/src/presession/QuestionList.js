import React from "react";
import { FiPlusCircle, FiTrash2, FiEdit3 } from "react-icons/fi";

import "./questionList.css";
import "../common.css";

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
          dispatch({ type: "SET_STAGE_QUIZ_LIST" });
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  };

  const QuestionListElement = ({ state, dispatch, question, index }) => {
    return (
      <div
        className="questionListElement"
        style={state.pickedQuestion === index ? { background: "#DDD" } : {}}
      >
        <div className="questionListElementInfo">
          <div style={{fontSize: "16px", fontWeight: "bold"}}>{question.content}</div>
          <div style={{fontSize: "11px"}}>Type: {question.answers.length > 1 ? "ABCD" : "Open"}</div>
        </div>
        <div className="questionListElementButtons">
          <FiTrash2
            onClick={() => {
              if (state.pickedQuestion === index) {
                dispatch({ type: "SET_PICKED_QUESTION", payload: -1 });
              }
              dispatch({ type: "DELETE_DESIGNER_QUESTION", payload: index });
            }}
            size={24}
          />
          <FiEdit3
            onClick={() =>
              dispatch({ type: "SET_PICKED_QUESTION", payload: index })
            }
            size={24}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="questionListView">
      <div className="questionListHeader">
        <h3>Questions</h3>
        <button
          type="button"
          onClick={() => dispatch({ type: "SET_PICKED_QUESTION", payload: -1 })}
          className="submit"
        >
          Add <FiPlusCircle size={16} />
        </button>
      </div>
      <div className="questionListContent">
        {state.designerQuestions.map((question, index) => {
          return (
            <QuestionListElement
              state={state}
              dispatch={dispatch}
              question={question}
              index={index}
            />
          );
        })}
      </div>
    </div>
  );
};

export default QuestionList;
