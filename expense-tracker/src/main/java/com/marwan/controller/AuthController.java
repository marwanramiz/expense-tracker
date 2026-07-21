package com.marwan.controller;
import com.marwan.model.User;
import com.marwan.service.UserService;
import com.marwan.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    @Autowired private UserService userService;
    @Autowired private JwtUtil jwtUtil;

    @PostMapping("/register")
    public User register(@RequestBody User user){
        return userService.save(user);
    }
    @PostMapping("/login")
    public String login(@RequestBody User user){
        Optional<User> existing = userService.findByUsername(user.getUsername());
        if(existing.isPresent() && existing.get().getPassword().equals(user.getPassword())){
            return jwtUtil.generateToken(user.getUsername());
        }
        throw new RuntimeException("Invalid credentials");

    }

}