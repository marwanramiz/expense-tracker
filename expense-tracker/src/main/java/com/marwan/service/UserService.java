package com.marwan.service;
import com.marwan.model.User;
import com.marwan.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    public UserService(UserRepository userRepository){
        this.userRepository=userRepository;
    }
    public User save(User user){
        return userRepository.save(user);
    }
    public Optional<User> findByUsername(String username){
        return userRepository.findByUsername(username);
    }
}