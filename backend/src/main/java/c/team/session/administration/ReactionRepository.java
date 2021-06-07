package c.team.session.administration;

import c.team.session.administration.model.Reaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface ReactionRepository extends MongoRepository<Reaction, String> {
    List<Reaction> findAllBySessionId(String sessionId);
}
