package c.team.quiz;

import c.team.quiz.model.Question;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface QuestionRepository extends MongoRepository<Question, String> {
    List<Question> findAllById(List<String> ids);
}
