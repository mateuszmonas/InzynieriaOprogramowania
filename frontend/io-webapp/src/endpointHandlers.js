export const getParticipantsHandler = (e, state, dispatch) => {
  e.preventDefault();

  (async () => {
    await fetch(process.env.REACT_APP_BACKEND_URL + `/session/${state.sessionId}/participant/list`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            identification: state.stage === "lecturer" ? state.username : state.guestId,
        }),
    })
        .then((response) => response.json())
        .then((data) => {
        dispatch({
          type: "SET_SESSION_OWNER",
          payload: data.leaderAccountName,
        });
        dispatch({
          type: "SET_PARTICIPANTS",
          payload: [
            { id: "", username: data.leaderAccountName, approved: true },
            ...data.participants,
          ],
        });
      })
      .catch((error) => {
        console.error(error);
      });
  })();
};

export const createHandler = (e, state, dispatch) => {
  e.preventDefault();
  console.log(state);
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
        console.log(data);
        if (state.stage === "designer")
          dispatch({ type: "SET_STAGE_QUIZ_LIST" });
        else
          state.quizId = data.quizId;
        console.log(state);
      })
      .catch((error) => {
        console.error(error);
      });
  })();
};
