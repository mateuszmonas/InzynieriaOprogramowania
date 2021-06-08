import React from "react";
import {FiArrowLeft, FiPlusCircle} from "react-icons/fi";

import "./quizList.css";
import "../common.css";

const QuizList = ({ state, dispatch }) => {
  const deleteHandler = (quizId) => {
    (async () => {
        await fetch(process.env.REACT_APP_BACKEND_URL + `/quiz/${quizId}`, {
            method: "DELETE",
            headers: {
                Authorization: state.token,
                "Content-Type": "application/json",
            },
        })
            .catch((error) => {
                console.error(error);
            });
        downloadQuizzes();
    })();
  };

  const downloadQuizzes = () => {
    (async () => {
      await fetch(process.env.REACT_APP_BACKEND_URL + "/quiz", {
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
  };

  React.useEffect(() => {
    downloadQuizzes();
  }, []);

  return (
    <div className="quizListView">
      <div className="quizListHeader">
        <h3>Quizzes</h3>
        <div className="quizListHeaderButtons">
          <button
            type="button"
            onClick={(e) => dispatch({ type: "SET_STAGE_ACCOUNT" })}
            className="submit"
          >
            Back <FiArrowLeft size={16} />
          </button>
          <button
            type="button"
            className="submit"
            onClick={() => {
              dispatch({ type: "SET_DESIGNER_QUESTIONS", payload: [] });
              dispatch({
                type: "SET_QUIZ_EDIT_MODE",
                payload: false
              })
              dispatch({
                type: "SET_QUIZ_ID",
                payload: ""
              })
              dispatch({
                type: "SET_QUIZ_NAME",
                payload: ""
              })
              dispatch({ type: "SET_STAGE_DESIGNER" });
            }}
          >
            New <FiPlusCircle size={16} />
          </button>
        </div>
      </div>

      <div className="quizListContent">
        {state.quizList.map((quiz, index) => {
          return (
            <div className="quizListElement">
              <div className="quizListElementInfo">
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {quiz.name}
                </div>
                <div style={{ fontSize: "11px", fontWeight: "bold" }}>
                  Questions: {quiz.questions.length}
                </div>
              </div>
              <div className="quizListElementButtons">
                <button
                  type="button"
                  className="submit"
                  onClick={(e) => {
                    dispatch({
                      type: "SET_DESIGNER_QUESTIONS",
                      payload: quiz.questions,
                    });
                    dispatch({
                      type: "SET_QUIZ_EDIT_MODE",
                      payload: true
                    })
                    dispatch({
                      type: "SET_QUIZ_ID",
                      payload: quiz.id
                    })
                    dispatch({
                      type: "SET_QUIZ_NAME",
                      payload: quiz.name
                    })
                    dispatch({ type: "SET_STAGE_DESIGNER" });
                  }}
                >
                  Edit
                </button>
              </div>
              <div className="quizListElementButtons">
                <button
                  type="button"
                  className="submit"
                  onClick={() => {
                    deleteHandler(quiz.id);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuizList;
