package c.team.session;

import c.team.session.model.Session;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.UUID;

public interface SessionRepository extends MongoRepository<Session, String> {
    Optional<Session> findSessionByPasscode(UUID passcode);

    Optional<Session> findSessionById(String id);
}
