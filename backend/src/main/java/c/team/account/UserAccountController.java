package c.team.account;

import c.team.account.model.LoginRequest;
import c.team.account.model.LoginResponse;
import c.team.account.model.RegisterAccountRequest;
import c.team.account.model.UserAccount;
import c.team.token.TokenService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
@AllArgsConstructor(onConstructor = @__(@Autowired))
public class UserAccountController {

    private final UserAccountService userAccountService;
    private final TokenService tokenService;

    @PostMapping("register")
    @ResponseStatus(HttpStatus.CREATED)
    public void register(@RequestBody RegisterAccountRequest request) {
        userAccountService.createAccount(request.getUsername(), request.getPassword());
    }

    @PostMapping("login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        UserAccount userAccount = userAccountService.findByUsernameAndPassword(request.getUsername(), request.getPassword());
        UUID token = tokenService.generateTokenForAccount(userAccount);
        LoginResponse loginResponse = new LoginResponse(token);
        return ResponseEntity.ok(loginResponse);
    }
}
