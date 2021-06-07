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
