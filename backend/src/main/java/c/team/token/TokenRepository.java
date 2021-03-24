package c.team.token;

import c.team.token.model.Token;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.UUID;


public interface TokenRepository extends MongoRepository<Token, String> {
    Token findTokenByValue(UUID value);
}
