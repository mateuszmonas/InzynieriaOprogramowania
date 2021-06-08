import React from "react";
import {Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis,} from "recharts";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";

import "./stats.css";

const Stats = ({state, dispatch}) => {
  const [picked, setPicked] = React.useState(0);
  const [questions, setQuestions] = React.useState([]);

  const getStats = () => {
    (async () => {
      await fetch(process.env.REACT_APP_BACKEND_URL + `/session/${state.sessionId}/statistics/answers`, {
        method: "GET",
        headers: {
          Authorization: state.token,
          "Content-Type": "application/json",
        },
      })
          .then((response) => response.json())
          .then((data) => {
            console.log(data);
            const dataReplies = [];

          for (const property in data.sessionAnswers.answerCounts) {
            const idx = parseInt(property.substring(14));
            dataReplies.push({
              answers: data.sessionAnswers.answerCounts[property],
              name: data.sessionAnswers.question.answers[idx].text,
              isCorrect: data.sessionAnswers.question.answers[idx].correct
            });
          }

          setQuestions(data.sessionAnswers.map((q) => {return ({
            content: q.question.content,
            answers: q.question.answers.map((answer) => {return answer.text}),
            replies: dataReplies
          })}));
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }

  React.useEffect(() => {
    const interval = setInterval(() => getStats(), 5000);
    return () => {
      clearInterval(interval);
    };
  }, [])

  // const sampleHistogram = [
  //   { students: 0, name: "0-10%" },
  //   { students: 1, name: "10-20%" },
  //   { students: 3, name: "20-30%" },
  //   { students: 5, name: "30-40%" },
  //   { students: 10, name: "40-50%" },
  //   { students: 11, name: "50-60%" },
  //   { students: 7, name: "60-70%" },
  //   { students: 6, name: "70-80%" },
  //   { students: 4, name: "80-90%" },
  //   { students: 3, name: "90-100%" },
  // ];

  // const sampleQuestions = [
  //   {
  //     id: 1,
  //     question: "What's the first letter of the alphabet?",
  //     answers: ["A", "D", "F", "P"],
  //     replies: [
  //       { answers: 3, name: "A", isCorrect: false },
  //       { answers: 8, name: "B", isCorrect: true },
  //       { answers: 2, name: "C", isCorrect: false },
  //       { answers: 2, name: "D", isCorrect: false },
  //     ],
  //   },
  //   {
  //     id: 2,
  //     question: "What colour is the water in Cracow?",
  //     answers: ["Green", "Blue", "Black", "Brown"],
  //     replies: [
  //       { answers: 7, name: "A", isCorrect: true },
  //       { answers: 6, name: "B", isCorrect: false },
  //       { answers: 3, name: "C", isCorrect: false },
  //       { answers: 12, name: "D", isCorrect: true },
  //     ],
  //   },
  // ];

  return (
    <div className="statsView" >

    <div className="statsGraphPicker">
      <FiChevronLeft size={32} onClick={() => setPicked((picked + questions.length) % (questions.length + 1))} />
      {questions.map((question, index) => {
        return (
          <div
            onClick={() => setPicked(index)}
            style={picked === index ? {} : {display: "none"}}
          >
            {question.content}
          </div>
        );
      })}
      <FiChevronRight size={32} onClick={() => setPicked((picked + 1) % (questions.length + 1))} />
    </div>

      <ResponsiveContainer width="95%" height="90%">
        {picked === 0 ? (
          <></>
        ) : (
          <BarChart data={questions[picked - 1].replies}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="answers" fill="rgb(179, 144, 79)">
              {questions[picked - 1].replies.map((entry, index) => (
                <Cell
                  fill={
                    questions[picked - 1].replies[index].isCorrect
                      ? "rgb(146, 208, 80)"
                      : "rgb(192, 80, 77)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default Stats;
