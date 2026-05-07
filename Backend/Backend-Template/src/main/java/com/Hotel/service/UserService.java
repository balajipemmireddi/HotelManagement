package com.Hotel.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.Hotel.entity.Users;
import com.Hotel.repository.UserRepo;

@Service
public class UserService {

    @Autowired
    private AuthenticationManager authmanager;

    @Autowired
    private JWTService jwtService;

    private BCryptPasswordEncoder encoder = new BCryptPasswordEncoder(12);

    // Inside UserService.java
    @Autowired
    private UserRepo usersRepository;

    // Master Login Method
    public String verify(Users user) {
        Authentication authentication = authmanager.authenticate(
                new UsernamePasswordAuthenticationToken(user.getEmail(), user.getPassword()));

        if (authentication.isAuthenticated()) {
            // ALWAYS fetch the real user from DB to get the true role
            Users realUser = usersRepository.findByEmail(user.getEmail());

            // Pass both username and role to the JWT Service
            return jwtService.generateToken(realUser.getEmail(), realUser.getRole());
        }
        return "Fail";
    }

    // Master Register Method
    public Users register(Users user) {
        user.setPassword(encoder.encode(user.getPassword()));

        // ALWAYS set a fallback default role if the frontend doesn't send one
        if (user.getRole() == null) {
            user.setRole(Users.Role.USER);
        }
        return usersRepository.save(user);
    }

    public Users getById(Long id) {
        return usersRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

}