import React from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
  ResponsiveContainer,
  Cell,
} from "recharts";

const Stats = ({ state, dispatch }) => {
  const [picked, setPicked] = React.useState(0);

  const sampleHistogram = [
    { students: 0, name: "0-10%" },
    { students: 1, name: "10-20%" },
    { students: 3, name: "20-30%" },
    { students: 5, name: "30-40%" },
    { students: 10, name: "40-50%" },
    { students: 11, name: "50-60%" },
    { students: 7, name: "60-70%" },
    { students: 6, name: "70-80%" },
    { students: 4, name: "80-90%" },
    { students: 3, name: "90-100%" },
  ];

  //  const sampleHistogram = [{
  //    values: [0, 1, 3, 5, 10, 11, 7, 6, 4, 3],
  //    title: "All Questions"
  // }]

  const sampleQuestions = [
    {
      id: 1,
      question: "What's the first letter of the alphabet?",
      answers: ["A", "D", "F", "P"],
      replies: [
        { answers: 3, name: "A", isCorrect: false },
        { answers: 8, name: "B", isCorrect: true },
        { answers: 2, name: "C", isCorrect: false },
        { answers: 2, name: "D", isCorrect: false },
      ],
    },
    {
      id: 2,
      question: "What colour is the water in Cracow?",
      answers: ["Green", "Blue", "Black", "Brown"],
      replies: [
        { answers: 7, name: "A", isCorrect: true },
        { answers: 6, name: "B", isCorrect: false },
        { answers: 3, name: "C", isCorrect: false },
        { answers: 12, name: "D", isCorrect: true },
      ],
    },
  ];

  return (
    <div className="stats" style={{ width: state.questionWidth }}>
      <ResponsiveContainer width="70%" height="70%">
        {picked === 0 ? (
          <BarChart data={sampleHistogram}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="students" fill="rgb(179, 144, 79)">
              {sampleHistogram.map((entry, index) => (
                <Cell
                  fill={
                    `rgb(${192 - 46 * index / 10}, ${80 + 128 * index / 10}, ${77 + 3 * index / 10})`
                  }
                />
              ))}
            </Bar>
          </BarChart>
        ) : (
          <BarChart data={sampleQuestions[picked - 1].replies}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="answers" fill="rgb(179, 144, 79)">
              {sampleQuestions[picked - 1].replies.map((entry, index) => (
                <Cell
                  fill={
                    sampleQuestions[picked - 1].replies[index].isCorrect
                      ? "rgb(146, 208, 80)"
                      : "rgb(192, 80, 77)"
                  }
                />
              ))}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
      <div className="graphPicker">
        <div
          onClick={() => setPicked(0)}
          className={picked === 0 ? "picked" : "notPicked"}
        >
          All Questions
        </div>
        {sampleQuestions.map((question) => {
          return (
            <div
              onClick={() => setPicked(question.id)}
              className={picked === question.id ? "picked" : "notPicked"}
            >
              Question {question.id}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Stats;
