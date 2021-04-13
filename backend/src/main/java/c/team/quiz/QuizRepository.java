package c.team.quiz;

import c.team.quiz.model.Quiz;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface QuizRepository extends MongoRepository<Quiz, String> {

    List<Quiz> findAllByUserId(String userId);

    Optional<Quiz> findByIdAndUserId(String id, String userId);
}
