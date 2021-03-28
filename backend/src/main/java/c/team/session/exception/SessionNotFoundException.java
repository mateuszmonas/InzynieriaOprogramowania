package c.team.session.exception;

import lombok.RequiredArgsConstructor;

public class SessionNotFoundException extends RuntimeException{

    public SessionNotFoundException(String message) { super(message); }

}
