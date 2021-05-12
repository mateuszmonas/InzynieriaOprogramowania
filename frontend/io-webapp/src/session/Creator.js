import React from "react";
import "./Session.css";

const Creator = ({ state, dispatch }) => {
  const [abcd, setAbcd] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [answers, setAnswers] = React.useState(["", "", "", ""]);
  const [corrects, setCorrects] = React.useState([false, false, false, false]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (question !== "") {
      const newQuestion = { question: question };
      if (answer !== "") {
        newQuestion.answers = { answers : [answer] };
      } else if (
        answers.length === 4 &&
        answers[0] !== "" &&
        answers[1] !== "" &&
        answers[2] !== "" &&
        answers[3] !== ""
      ) {
        newQuestion.answers = { answers : answers };
      }
      const msg = {
        type : "quiz",
        content: newQuestion, 
      };
      state.socket.sendMessage(msg);
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
          state.designerQuestions[state.pickedQuestion].answers.length > 1
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
    <div className="question" style={{ width: state.questionWidth }}>
      <form className="newquestion" onSubmit={submitHandler}>
        <div className="newQuestionBox">
          <label htmlFor="questionText">Question: </label>
          <input
            type="text"
            id="questionText"
            name="questionText"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></input>
        </div>
        <button
          type="button"
          className="answerButton"
          onClick={() => setAbcd(!abcd)}
          style={{ marginBottom: "10vh" }}
        >
          {abcd ? "ABCD" : "Open"}
        </button>
        <div>
          {abcd ? (
            <>
              <div className="abcdAnswer">
                <label htmlFor="aText">A: </label>
                <input
                  type="text"
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
                <label htmlFor="aCorrect"> Correct?</label>
                <input
                  type="checkbox"
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

              <div className="abcdAnswer">
                <label htmlFor="bText">B: </label>
                <input
                  type="text"
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
                <label htmlFor="bCorrect"> Correct?</label>
                <input
                  type="checkbox"
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

              <div className="abcdAnswer">
                <label htmlFor="cText">C: </label>
                <input
                  type="text"
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
                <label htmlFor="cCorrect"> Correct?</label>
                <input
                  type="checkbox"
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

              <div className="abcdAnswer">
                <label htmlFor="dText">D: </label>
                <input
                  type="text"
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
                <label htmlFor="dCorrect"> Correct?</label>
                <input
                  type="checkbox"
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
            <>
              <label htmlFor="answerText">Answer: </label>
              <input
                type="text"
                id="answerText"
                name="answerText"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              ></input>
            </>
          )}
        </div>
        <button
          type="submit"
          className="answerButton"
          style={{ marginBottom: "10vh" }}
        >
          {(state.stage === "designer" && state.pickedQuestion) >= 0
            ? "Edit Question"
            : "Add Question"}
        </button>
      </form>
    </div>
  );
};

export default Creator;
