import React from "react";

const Creator = (props) => {
  const [abcd, setAbcd] = React.useState(false);
  const [question, setQuestion] = React.useState("");
  const [answer, setAnswer] = React.useState("");
  const [answers, setAnswers] = React.useState(["", "", "", ""]);

  const submitHandler = (e) => {
    /* TODO */
    e.preventDefault();
    if (question !== "") {
      const newQuestion = { question };
      if (answer !== "") {
        newQuestion.answer = { answer };
        console.log(newQuestion);
      } else if (
        answers.length === 4 &&
        answers[0] !== "" &&
        answers[1] !== "" &&
        answers[2] !== "" &&
        answers[3] !== ""
      ) {
        newQuestion.answers = { answers };
        console.log(newQuestion);
      }
    }
    setQuestion("");
    setAnswer("");
    setAnswers(["", "", "", ""]);
  };

  return (
    <div className="question" style={{ width: props.width }}>
      <form onSubmit={submitHandler}>
        <div>
          <label htmlFor="questionText">Question: </label>
          <input
            type="text"
            id="questionText"
            name="questionText"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></input>
        </div>
        <button type="button" onClick={() => setAbcd(!abcd)}>
          {abcd ? "ABCD" : "Open"}
        </button>
        <div>
          {abcd ? (
            <>
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
        <button type="submit">Add Question</button>
      </form>
    </div>
  );
};

export default Creator;
