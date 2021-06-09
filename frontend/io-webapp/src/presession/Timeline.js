import React from "react"
import { Chrono } from "react-chrono";
import { FiArrowLeft } from "react-icons/fi";

import "./Timeline.css";
import "./Account.css"

const Timeline = ({ state, dispatch }) => {
  const FindQuestion = (questionId) => {
    console.log(timelineQuizzes);
    for (let i = 0; i < state.timelineQuizzes.length; ++i) {
      const quiz = state.timelineQuizzes[i];
      for (let j = 0; j < quiz.questions.length; ++j) {
        const question = quiz.questions[j];
        if (question.id === questionId)
          return [j, question.content, j === quiz.questions.length - 1];
      }
    }
    return [-1, "Unknown", false];
  }

  const ParseQuiz = (quiz) => {
    state.timelineQuizzes = [...state.timelineQuizzes, quiz];
    let quizData = [];
    quiz.questions.forEach((question, index) => {
      if (!question.open) {
        quizData.push("Question " + (index + 1) + ": " + question.content);
        question.answers.forEach(answer => {
          quizData.push("    - " + answer.text + (answer.correct ? " (correct)" : " (incorrect)"));
        });
      }
      else
        quizData.push("Question " + (index + 1) + ": " + question.content + " (open question)")
    });
    console.log(quizData);
    return quizData;
  }

  const ParseAnswers = (answers, sender) => {
    const questionId = Object.keys(answers)[0];
    const metadata = FindQuestion(questionId);
    console.log(metadata);
    const quizIdx = metadata[0];
    const questionTitle = metadata[1];
    const isLast = metadata[2];
    let idx = -1;

    for (let i = 0; i < state.timelineAnswerSets.length; ++i) {
      const answerSet = state.timelineAnswerSets[i];
      if (answerSet.sender === sender && answerSet.quizIdx === quizIdx) {
        idx = i;
        break;
      }
    }

    console.log(idx);

    if (idx === -1) {
      idx = state.timelineAnswerSets.length;
      console.log(questionTitle);
      console.log(answers[questionId]);

      const answerInfo = {
        sender: sender,
        quizIdx: quizIdx,
        questionTitles: [questionTitle],
        answers: [answers[questionId]]
      }
      state.timelineAnswerSets = [...state.timelineAnswerSets, answerInfo];

      console.log(state.timelineAnswerSets);
    }
    else {
      state.timelineAnswerSets[idx].questionTitles =
        [...state.timelineAnswerSets.questionTitles, questionTitle];
      state.timelineAnswerSets[idx].answers =
        [...state.timelineAnswerSets[idx].answers, answers];
    }

    console.log(state.timelineAnswerSets);

    if (isLast) {
      let text = [];
      for (let i = 0; i < state.timelineAnswerSets[idx].questionTitles; ++i) {
        const title = state.timelineAnswerSets[idx].questionTitles[i];
        const questionAnswers = state.timelineAnswerSets[idx].answers[i];
        text.push("Question " + (i + 1) + ": " + title);
        for (let j = 0; j < questionAnswers.length; ++j) {
          const answer = questionAnswers[j];
          text.push("    -> " + answer)
        }
      }

      console.log(text)

      const answerInfo = {
        title: "ANSWERS",
        cardTitle: state.timelineQuizzes[quizIdx].name,
        cardSubtitle: sender,
        cardDetailedText: text
      };
      state.timelineAnswerSets.splice(idx, 1);

      return answerInfo;
    }

  };

  const CountEmotes = (emote, timestamp) => {
    if (state.timelineEmoteInfo.counts.length === 0)
      state.timelineEmoteInfo.firstTimestamp = timestamp;

    const idx = state.timelineEmoteInfo.emotes.indexOf(emote);
    if (idx === -1) {
      state.timelineEmoteInfo.emotes = [...state.timelineEmoteInfo.emotes, emote];
      state.timelineEmoteInfo.counts = [...state.timelineEmoteInfo.counts, 0];
      state.timelineEmoteInfo.lastTimestamp = timestamp;
    }
    else state.timelineEmoteInfo.counts[idx]++;
  }

  const ResetEmoteInfo = () => {
    state.timelineEmoteInfo = {
      emotes: [],
      counts: [],
      firstTimestamp: "",
      lastTimestamp: ""
    };
  };

  const FlushEmotes = () => {
    let text = [];
    for(let i = 0; i < state.timelineEmoteInfo.emotes.length; ++i)
      text.push(state.timelineEmoteInfo.emotes[i] + " x" + state.timelineEmoteInfo.counts[i]);
    const emoteInfo = {
      title: "EMOTES",
      cardTitle: "EMOTES",
      cardSubtitle: state.timelineEmoteInfo.firstTimestamp + " - " + state.timelineEmoteInfo.lastTimestamp,
      cardDetailedText: text
    };
    ResetEmoteInfo();
    return emoteInfo;
  }

  const ParseMessage = (message) => {
    console.log(message.content);
    const contentJSON = JSON.parse(message.content);
    if (message.type !== "EMOTE" && state.timelineEmoteInfo.length > 0)
        return [FlushEmotes(), ParseMessage(message)];

    switch (message.type){
      case "COMMENT":
        return {
          title: "CHAT",
          cardTitle: message.sender,
          cardSubtitle: message.timestamp,
          cardDetailedText: contentJSON
        };
      case "QUIZ":
        return {
          title: "QUIZ",
          cardTitle: contentJSON.name,
          cardSubtitle: message.timestamp,
          cardDetailedText: ParseQuiz(contentJSON)
        };
      case "QUIZ_ANSWERS":
        return ParseAnswers(contentJSON, message.sender);
      case "EMOTE":
        CountEmotes(contentJSON, message.timestamp);
    }
  };

  const CreateTimelineItems = (messageLog) => {
    let items = [];
    console.log(messageLog);
    for (let i = 0; i < messageLog.length; ++i){
      const message = messageLog[i];
      console.log(message);
      const parsedMessage = ParseMessage(message);
      if (parsedMessage && Array.isArray(parsedMessage))
        items.push.apply(items, parsedMessage);
      else if (parsedMessage)
        items.push(parsedMessage);
    }
    if (state.timelineEmoteInfo.emotes.length > 0)
      items.push(FlushEmotes());

    return items;
  }

  const ParseSessions = () => {
    state.timelineQuizzes = [];
    ResetEmoteInfo();
    state.timelineAnswerSets = [];
    return (
      <Chrono
        items={
          CreateTimelineItems(state
            .sessionHistory[state.pickedSession]
            .log
            .slice(1, state.sessionHistory[state.pickedSession].log.length))
        }
        theme={{primary: "grey", secondary: "yellow", cardBgColor: "#cccccc"}}
        mode="VERTICAL"
        useReadMore="true"
        hideControls="false"
        scrollable="true"
      />
    );
  };

  React.useEffect(() => {
    (async () => {
      await fetch(process.env.REACT_APP_BACKEND_URL + "/history", {
        method: "GET",
        headers: {
          Authorization: state.token,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          dispatch({
            type: "SET_SESSION_HISTORY",
            payload: data.sessions,
          });
        })
        .catch((error) => {
          console.error(error);
        });
    })();
  }, []);
  return (
    <div className="quizListView">
      <div className="session-history-header">
        <h3>Session history</h3>
        <div className="quizListHeaderButtons">
          <button
            type="button"
            onClick={(e) => dispatch({type: "SET_STAGE_ACCOUNT"})}
            className="submit"
          >
            Back <FiArrowLeft size={16}/>
          </button>
        </div>
      </div>
      <div className="session-history-view">
        <div className="session-history-content">
          {state.sessionHistory.map((session, index) => {
            return (
              <div className="session-history-element">
                <button
                  className="session-history-button"
                  onClick={(e) => {
                    dispatch({type: "SET_PICKED_SESSION_IN_HISTORY", payload: index})
                  }}
                >
                  {session.title}
                </button>
              </div>
            );
          })}
        </div>

        <div className="session-timeline-content">
          {state.isSessionTimelineVisible ? (
            <div>
              <div className="session-title">
                <h2 className="session-title-text">{state.sessionHistory[state.pickedSession].title}</h2>
              </div>
              <div className="timeline-content">
                <ParseSessions/>
              </div>
            </div>
          ) : (
            <div className="session-title">
              <h2>Select session to view timeline</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Timeline;