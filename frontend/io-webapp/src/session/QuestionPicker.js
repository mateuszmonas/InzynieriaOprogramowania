import React from "react";
import Popup from "reactjs-popup";
import { FiPlusCircle, FiSend } from "react-icons/fi";

import Creator from "./Creator";

import "./questionPicker.css";
import "../common.css";

const QuestionPicker = ({ state, dispatch }) => {
  React.useEffect(() => {
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
  }, []);

  // const [open, setOpen] = React.useState(false);
  const ref = React.useRef();
  const openCreator = () => ref.current.open();
  const closeCreator = () => ref.current.close();

  return (
    <div className="questionPickerView">
      <div className="questionPickerHeader">
        <h3>Quizzes</h3>
        <div className="questionPickerHeaderButtons">
          <button
            type="button"
            className="submit"
            onClick={() => {
              // dispatch({ type: "SET_DESIGNER_QUESTIONS", payload: [] });
              openCreator();
            }}
          >
            New <FiPlusCircle size={16} />
          </button>
      <Popup ref={ref} modal >
        <div className="creatorPopup">
          <Creator
            state={state}
            dispatch={dispatch}
            close={closeCreator}
          />
        </div>
      </Popup>
        </div>
      </div>

      <div className="questionPickerContent">
        {state.quizList.map((quiz) => {
          return (
            <div className="questionPickerElement">
              <div className="questionPickerElementInfo">
                <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                  {quiz.id}
                </div>
                <div style={{ fontSize: "11px", fontWeight: "bold" }}>
                  Questions: {quiz.questions.length}
                </div>
              </div>
              <div className="questionPickerElementButtons">
                <FiSend size={16} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuestionPicker;
