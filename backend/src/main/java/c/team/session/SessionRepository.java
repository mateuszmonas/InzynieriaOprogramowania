package c.team.session;

import c.team.session.model.Session;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.UUID;

public interface SessionRepository extends MongoRepository<Session, UUID> {
    Session findSessionByPasscode(UUID passcode);
    Session findSessionById(String id);
}
