import React from "react";
import Creator from "../session/Creator";
import QuestionList from "./QuestionList";
import {FiArrowLeft, FiSave} from "react-icons/fi";

import "./Account.css";
import "./designer.css";

const Designer = ({ state, dispatch }) => {
  const createHandler = (e) => {
    e.preventDefault();
    console.log(state.designerQuestions);
    (async () => {
      await fetch(process.env.REACT_APP_BACKEND_URL + "/quiz", {
        method: "POST",
        headers: {
          Authorization: state.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: state.quizName,
          questions: state.designerQuestions,
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

  const editHandler = (e) => {
    e.preventDefault();
    console.log(state.designerQuestions);
    (async () => {
      await fetch(process.env.REACT_APP_BACKEND_URL + `/quiz/${state.quizId}`, {
        method: "PUT",
        headers: {
          Authorization: state.token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: state.quizName,
          questions: state.designerQuestions,
        }),
      })
          .then(() => {
          dispatch({ type: "SET_STAGE_QUIZ_LIST" });
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  };

  return (
    <div className="designer">
      <div className="designerHeader">
        <h3>Question Designer</h3>
        <div className="designerHeaderButtons">
          <button
            type="button"
            onClick={(e) => dispatch({ type: "SET_STAGE_QUIZ_LIST" })}
            className="submit"
          >
            Back <FiArrowLeft size={16} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              state.editMode
                ? editHandler(e)
                : createHandler(e);
            }}
            className="submit"
          >
            Save <FiSave size={16} />
          </button>
        </div>
      </div>
      <div className="designerContent">
        <div className="designerSidebar">
          <div>
            <label htmlFor="quizName">Quiz Name</label>
            <input
              type="text"
              className="designerSidebarInput"
              id="quizName"
              name="quizName"
              value={state.quizName}
              onChange={(e) =>
                dispatch({ type: "SET_QUIZ_NAME", payload: e.target.value })
              }
            ></input>
          </div>
          <QuestionList state={state} dispatch={dispatch} />
        </div>
        <Creator state={state} dispatch={dispatch} />
      </div>
    </div>
  );
};

export default Designer;
