package c.team.token;

import c.team.account.model.UserAccount;
import c.team.token.exception.TokenNotFoundException;
import c.team.token.model.Token;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class TokenService {

    TokenRepository tokenRepository;

    public String getLoginForToken(UUID token) {
        return Optional.ofNullable(tokenRepository.findTokenByValue(token)).orElseThrow(TokenNotFoundException::new).getUsername();
    }

    public UUID generateTokenForAccount(UserAccount userAccount) {
        Token token = Token.builder()
                .username(userAccount.getUsername())
                .value(UUID.randomUUID())
                .build();
        return tokenRepository.save(token).getValue();
    }
}
