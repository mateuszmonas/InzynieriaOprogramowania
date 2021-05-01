package c.team.session.statistics;

import c.team.session.statistics.model.SessionAnswers;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface SessionAnswersRepository extends MongoRepository<SessionAnswers, String> {

    Optional<SessionAnswers> findBySessionIdAndQuestionId(String sessionId, String questionId);

    List<SessionAnswers> findAllBySessionId(String sessionId);
}
