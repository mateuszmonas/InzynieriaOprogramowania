package c.team.account;

import c.team.account.model.LoginRequest;
import c.team.account.model.RegisterAccountRequest;
import c.team.account.model.UserAccount;
import c.team.token.TokenService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.User;
import org.springframework.web.bind.annotation.*;

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
    public ResponseEntity<UUID> login(@RequestBody LoginRequest request) {
        UserAccount userAccount = userAccountService.findByUsernameAndPassword(request.getUsername(), request.getPassword());
        return ResponseEntity.ok(tokenService.generateTokenForAccount(userAccount));
    }

    @GetMapping("user")
    public User getUser(@AuthenticationPrincipal final User user) {
        return user;
    }
}
