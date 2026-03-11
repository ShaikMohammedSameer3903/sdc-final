package com.apnaride.controller;
import com.apnaride.model.User;
import com.apnaride.repository.UserRepository;
import com.apnaride.dto.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private static final String ADMIN_EMAIL = "admin@apnaride.com";
    private static final String ADMIN_ROLE = "admin";

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@RequestBody AuthRequest signUpRequest) {
        if (signUpRequest.getEmail() == null || signUpRequest.getEmail().isBlank()
            || signUpRequest.getPassword() == null || signUpRequest.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Invalid email or password (min 6 chars).");
        }

        if (ADMIN_ROLE.equalsIgnoreCase(signUpRequest.getRole()) || ADMIN_EMAIL.equalsIgnoreCase(signUpRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin account cannot be created via signup.");
        }
        if (userRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already registered.");
        }

        User user = new User();
        user.setName(signUpRequest.getName());
        user.setEmail(signUpRequest.getEmail());
        // encode password before saving
        user.setPassword(passwordEncoder.encode(signUpRequest.getPassword()));
        user.setRole(signUpRequest.getRole() == null ? "user" : signUpRequest.getRole());

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getRole(),
            savedUser.getPhone(),
            savedUser.getEmergencyPhone()
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest registerRequest) {
        if (registerRequest.getEmail() == null || registerRequest.getEmail().isBlank()
            || registerRequest.getPassword() == null || registerRequest.getPassword().length() < 6) {
            return ResponseEntity.badRequest().body("Invalid email or password (min 6 chars).");
        }

        if (ADMIN_ROLE.equalsIgnoreCase(registerRequest.getRole()) || ADMIN_EMAIL.equalsIgnoreCase(registerRequest.getEmail())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin account cannot be created via register.");
        }
        if (userRepository.findByEmail(registerRequest.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Email is already registered.");
        }

        User user = new User();
        user.setName(registerRequest.getName());
        user.setEmail(registerRequest.getEmail());
        // encode password before saving
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setRole(registerRequest.getRole() == null ? "user" : registerRequest.getRole());

        User savedUser = userRepository.save(user);

        return ResponseEntity.ok(new AuthResponse(
            savedUser.getId(),
            savedUser.getName(),
            savedUser.getEmail(),
            savedUser.getRole(),
            savedUser.getPhone(),
            savedUser.getEmergencyPhone()
        ));
    }

    @PostMapping("/signin")
    public ResponseEntity<?> signIn(@RequestBody AuthRequest signInRequest) {
        Optional<User> userOptional = userRepository.findByEmail(signInRequest.getEmail());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }

        User user = userOptional.get();
        String storedPassword = user.getPassword();
        if (storedPassword == null || storedPassword.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }

        boolean matches = passwordEncoder.matches(signInRequest.getPassword(), storedPassword);

        // Backward compatibility: if password was stored as plain text previously,
        // accept it once and migrate to encoded BCrypt password.
        if (!matches && !storedPassword.startsWith("$2") && storedPassword.equals(signInRequest.getPassword())) {
            user.setPassword(passwordEncoder.encode(signInRequest.getPassword()));
            userRepository.save(user);
            matches = true;
        }

        if (!matches) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password.");
        }

        return ResponseEntity.ok(new AuthResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getPhone(),
            user.getEmergencyPhone()
        ));
    }

    @PostMapping("/setup-password")
    public ResponseEntity<?> setupPassword(@RequestBody Map<String, String> body) {
        String email = body.get("email");
        String password = body.get("password");
        if (email == null || password == null || password.length() < 6) {
            return ResponseEntity.badRequest().body("Invalid email or password (min 6 chars).");
        }
        User user = userRepository.findByEmail(email).orElse(null);
        if (user == null) return ResponseEntity.badRequest().body("User not found.");
        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            return ResponseEntity.badRequest().body("Password already set.");
        }
        user.setPassword(passwordEncoder.encode(password));
        userRepository.save(user);
        return ResponseEntity.ok("Password set. You can now login normally.");
    }
}