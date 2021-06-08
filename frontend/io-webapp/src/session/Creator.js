import React from "react";

import "./creator.css";
import { FiCheckSquare } from "react-icons/fi";

const Creator = ({ state, dispatch, close }) => {
  const [abcd, setAbcd] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [answers, setAnswers] = React.useState(["", "", "", ""]);
  const [corrects, setCorrects] = React.useState([false, false, false, false]);

  const oneQuestionQuizHandler = () => {
    (async () => {
      const quizIdJson = await fetch(process.env.REACT_APP_BACKEND_URL + "/quiz", {
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
        .catch((error) => {
          console.error(error);
        });

      state.quizId = quizIdJson.quizId;

      await fetch(process.env.REACT_APP_BACKEND_URL + "/quiz/" + state.quizId, {
        method: "GET",
        headers: {
          Authorization: state.token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const quiz = data;
          const msg = {
            type : "quiz",
            content: quiz,
          };
          state.socket.sendMessage(msg);
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  };

   const submitHandler = (e) => {
    e.preventDefault();

    if (question !== "") {
      const newQuestion = {content: question};
      newQuestion.open = !abcd;
      if (answer !== "") {
        newQuestion.answers = [{ text: answer, correct: true }];
      } else if (!newQuestion.open) {
        newQuestion.answers = answers.map((answer, index) => {
          return {
            text: answer,
            correct: corrects[index],
          };
        });
      }

      console.log(newQuestion);

      if (state.stage !== "designer") {
        state.designerQuestions = [newQuestion];
        state.quizName = question;
        oneQuestionQuizHandler();
      }
      else {
        if (state.pickedQuestion < 0) {
          dispatch({ type: "ADD_DESIGNER_QUESTION", payload: newQuestion });
        } else {
          dispatch({
            type: "UPDATE_DESIGNER_QUESTION",
            payload: { index: state.pickedQuestion, question: newQuestion },
          });
          dispatch({ type: "SET_PICKED_QUESTION", payload: -1 });
        }
      }
    }

    setQuestion("");
    setAnswer("");
    setAnswers(["", "", "", ""]);
    setCorrects([false, false, false, false]);
  };

  React.useEffect(() => {
    if (state.stage === "designer") {
      if (state.pickedQuestion < 0) {
        setQuestion("");
        setAnswer("");
        setAnswers(["", "", "", ""]);
        setCorrects([false, false, false, false]);
      } else {
        setQuestion(state.designerQuestions[state.pickedQuestion].content);
        if (!state.designerQuestions[state.pickedQuestion].answers) {
          setAbcd(false);
          setQuestion("");
          setAnswer("");
          setAnswers(["", "", "", ""]);
          setCorrects([false, false, false, false]);
        } else if (
          !state.designerQuestions[state.pickedQuestion].open
        ) {
          setAbcd(true);
          setAnswers([
            state.designerQuestions[state.pickedQuestion].answers[0].text,
            state.designerQuestions[state.pickedQuestion].answers[1].text,
            state.designerQuestions[state.pickedQuestion].answers[2].text,
            state.designerQuestions[state.pickedQuestion].answers[3].text,
          ]);
          setCorrects([
            state.designerQuestions[state.pickedQuestion].answers[0].correct,
            state.designerQuestions[state.pickedQuestion].answers[1].correct,
            state.designerQuestions[state.pickedQuestion].answers[2].correct,
            state.designerQuestions[state.pickedQuestion].answers[3].correct,
          ]);
        } else {
          setAbcd(false);
          setAnswer(
            state.designerQuestions[state.pickedQuestion].answers[0].text
          );
        }
      }
    }
  }, [state.pickedQuestion]);

  return (
    <div
      className="questionDesign"
      style={state.stage === "designer" ? {} : { width: "100%" }}
    >
      <form className="newQuestion" onSubmit={submitHandler}>
        <div className="newQuestionBox" style={{ height: "10%" }}>
          <div className="questionText">Question </div>
          <input
            type="text"
            style={{ fontSize: "24px" }}
            id="questionText"
            name="questionText"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></input>
        </div>

        <div className="newQuestionBox" style={{ height: "15%" }}>
          <div className="questionText">Question type </div>
          <div className="creatorRadio">
            <input
              type="radio"
              id="abcd"
              name="abcd"
              checked={abcd}
              onClick={() => setAbcd(true)}
            />
            <label for="abcd">ABCD</label>
          </div>
          <div className="creatorRadio">
            <input
              type="radio"
              id="open"
              name="open"
              checked={!abcd}
              onClick={() => setAbcd(false)}
            />
            <label for="open">Open</label>
          </div>
        </div>

        <div className="newQuestionBox" style={{ height: "50%" }}>
          <div className="creatorAnswersHeader">
            <div className="questionText">{abcd ? "Answers" : "Answer"} </div>
            {abcd && <FiCheckSquare />}
          </div>
          {abcd ? (
            <>
              <div className="creatorAnswer">
                <label htmlFor="aText">A</label>
                <input
                  type="text"
                  className="creatorAnswersText"
                  id="aText"
                  name="aText"
                  value={answers[0]}
                  onChange={(e) =>
                    setAnswers([
                      e.target.value,
                      answers[1],
                      answers[2],
                      answers[3],
                    ])
                  }
                ></input>
                <input
                  type="checkbox"
                  className="creatorAnswersCheckbox"
                  id="aCorrect"
                  name="aCorrect"
                  checked={corrects[0]}
                  onChange={(e) =>
                    setCorrects([
                      !corrects[0],
                      corrects[1],
                      corrects[2],
                      corrects[3],
                    ])
                  }
                ></input>
              </div>

              <div className="creatorAnswer">
                <label htmlFor="bText">B</label>
                <input
                  type="text"
                  className="creatorAnswersText"
                  id="bText"
                  name="bText"
                  value={answers[1]}
                  onChange={(e) =>
                    setAnswers([
                      answers[0],
                      e.target.value,
                      answers[2],
                      answers[3],
                    ])
                  }
                ></input>
                <input
                  type="checkbox"
                  className="creatorAnswersCheckbox"
                  id="bCorrect"
                  name="bCorrect"
                  checked={corrects[1]}
                  onChange={(e) =>
                    setCorrects([
                      corrects[0],
                      !corrects[1],
                      corrects[2],
                      corrects[3],
                    ])
                  }
                ></input>
              </div>

              <div className="creatorAnswer">
                <label htmlFor="cText">C</label>
                <input
                  type="text"
                  className="creatorAnswersText"
                  id="cText"
                  name="cText"
                  value={answers[2]}
                  onChange={(e) =>
                    setAnswers([
                      answers[0],
                      answers[1],
                      e.target.value,
                      answers[3],
                    ])
                  }
                ></input>
                <input
                  type="checkbox"
                  className="creatorAnswersCheckbox"
                  id="cCorrect"
                  name="cCorrect"
                  checked={corrects[2]}
                  onChange={(e) =>
                    setCorrects([
                      corrects[0],
                      corrects[1],
                      !corrects[2],
                      corrects[3],
                    ])
                  }
                ></input>
              </div>

              <div className="creatorAnswer">
                <label htmlFor="dText">D</label>
                <input
                  type="text"
                  className="creatorAnswersText"
                  id="dText"
                  name="dText"
                  value={answers[3]}
                  onChange={(e) =>
                    setAnswers([
                      answers[0],
                      answers[1],
                      answers[2],
                      e.target.value,
                    ])
                  }
                ></input>
                <input
                  type="checkbox"
                  className="creatorAnswersCheckbox"
                  id="dCorrect"
                  name="dCorrect"
                  checked={corrects[3]}
                  onChange={(e) =>
                    setCorrects([
                      corrects[0],
                      corrects[1],
                      corrects[2],
                      !corrects[3],
                    ])
                  }
                ></input>
              </div>
            </>
          ) : (
            <div style={{ height: "70%", width: "100%" }}>
              <div className="creatorAnswer">
                <input
                  type="text"
                  className="creatorAnswersText"
                  id="answerText"
                  name="answerText"
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                ></input>
              </div>
            </div>
          )}
        </div>
        <div className="newQuestionBox" style={{ height: "10%" }}>
          <div className="creatorBottomButtons">
            <button
              type="button"
              className="cancel"
              onClick={() => {
                dispatch({ type: "SET_PICKED_QUESTION", payload: -1 });
                if (close) close();
              }}
            >
              Cancel
            </button>
            <button type="submit" className="submitFlat">
              {(state.stage === "designer" && state.pickedQuestion >= 0)
                ? "Edit Question"
                : "Add Question"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Creator;
