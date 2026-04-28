package com.example.notification.controller;

import com.example.notification.model.UserAccount;
import com.example.notification.repository.UserRepository;
import com.example.notification.security.CustomUserDetailsService;
import com.example.notification.security.JwtUtil;
import com.example.notification.service.MailService;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService userDetailsService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MailService mailService;

    // TODO: Replace with your actual Google Client ID from .env
    private static final String CLIENT_ID = System.getenv("GOOGLE_CLIENT_ID");

    public record GoogleAuthRequest(String idToken) {
    }

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody GoogleAuthRequest request) {
        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(new NetHttpTransport(), new GsonFactory())
                    .setAudience(Collections.singletonList(CLIENT_ID))
                    .build();

            GoogleIdToken idToken = verifier.verify(request.idToken());
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                String email = payload.getEmail();
                String name = (String) payload.get("name");

                UserAccount user = userRepository.findByEmail(email).orElseGet(() -> {
                    UserAccount newUser = new UserAccount(email, email, ""); // Password empty for Google users
                    newUser.setEnabled(true);
                    newUser.setProvider("google");
                    return userRepository.save(newUser);
                });

                final UserDetails userDetails = userDetailsService.loadUserByUsername(user.getUsername());
                final String jwt = jwtUtil.generateToken(userDetails);

                return ResponseEntity.ok(new AuthResponse(jwt, user.getUsername(), user.getEmail()));
            } else {
                return ResponseEntity.status(401).body("Invalid Google token");
            }
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error during Google authentication: " + e.getMessage());
        }
    }

    public record AuthRequest(String username, String password, String email) {
    }

    public record AuthResponse(String token, String username, String email) {
    }

    public record ForgotPasswordRequest(String email) {
    }

    public record ResetPasswordRequest(String token, String newPassword) {
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthRequest authRequest) throws Exception {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.username(), authRequest.password()));
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Incorrect username or password, or account not verified");
        }

        UserAccount user = userRepository.findByUsername(authRequest.username()).get();
        final UserDetails userDetails = userDetailsService.loadUserByUsername(authRequest.username());
        final String jwt = jwtUtil.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(jwt, userDetails.getUsername(), user.getEmail()));
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AuthRequest authRequest) {
        if (userRepository.findByUsername(authRequest.username()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Username is already taken!");
        }
        if (userRepository.findByEmail(authRequest.email()).isPresent()) {
            return ResponseEntity.badRequest().body("Error: Email is already in use!");
        }

        UserAccount user = new UserAccount(
                authRequest.username(),
                authRequest.email(),
                passwordEncoder.encode(authRequest.password()));
        
        String token = java.util.UUID.randomUUID().toString();
        user.setVerificationToken(token);
        user.setEnabled(false);

        userRepository.save(user);
        
        mailService.sendVerificationEmail(user.getEmail(), token);

        return ResponseEntity.ok("User registered successfully. Please check your email to verify your account.");
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyUser(@RequestParam String token) {
        return userRepository.findByVerificationToken(token)
                .map(user -> {
                    user.setEnabled(true);
                    user.setVerificationToken(null);
                    userRepository.save(user);
                    return ResponseEntity.ok("Account verified successfully!");
                })
                .orElse(ResponseEntity.badRequest().body("Invalid verification token"));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return userRepository.findByEmail(request.email())
                .map(user -> {
                    String token = java.util.UUID.randomUUID().toString();
                    user.setResetToken(token);
                    userRepository.save(user);
                    mailService.sendPasswordResetEmail(user.getEmail(), token);
                    return ResponseEntity.ok("Password reset link sent to your email.");
                })
                .orElse(ResponseEntity.badRequest().body("Email not found"));
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
        return userRepository.findByResetToken(request.token())
                .map(user -> {
                    user.setPassword(passwordEncoder.encode(request.newPassword()));
                    user.setResetToken(null);
                    userRepository.save(user);
                    return ResponseEntity.ok("Password reset successfully!");
                })
                .orElse(ResponseEntity.badRequest().body("Invalid reset token"));
    }
}
