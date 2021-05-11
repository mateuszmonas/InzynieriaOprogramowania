package c.team.session.administration;

import c.team.session.administration.model.Session;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SessionRepository extends MongoRepository<Session, String> {
    Optional<Session> findSessionByPasscode(UUID passcode);
    Optional<Session> findSessionById(String id);
    Optional<Session> findSessionByGuestApprovalRoomId(UUID guestApprovalRoomId);
    Optional<List<Session>> findSessionsByLeaderAccountId(String leaderAccountId);
}
