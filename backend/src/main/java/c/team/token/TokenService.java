package c.team.token;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class TokenService {

    private final Map<String, String> tokens = new HashMap<>();

    public String getLoginForToken(String token) {
        return tokens.get(token);
    }

    public String generateTokenForLogin(String login) {
        String token = UUID.randomUUID().toString();
        tokens.put(token, login);
        return token;
    }

}
