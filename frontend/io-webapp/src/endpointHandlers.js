export const getParticipantsHandler = (e, state, dispatch) => {
    e.preventDefault();

    (async () => {
      await fetch("http://localhost:8080/session/participant-list", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identification: state.stage === "lecturer" ? state.username : state.guestId,
          sessionId: state.sessionId,
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

export const getSessionHistoryHandler = (e, state, dispatch) => {
    e.preventDefault();

    (async () => {
        await fetch("http://localhost:8080/session/history", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((response ) => response.json())
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
};
