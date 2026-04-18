package com.bank.banking_app;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository repo;

    @PostMapping("/register")
    public String register(@RequestBody User user) {
        repo.save(user);
        return "Register Success";
    }

    @PostMapping("/login")
    public String login(@RequestBody User user) {

        System.out.println("Input Username: " + user.getUsername());
        System.out.println("Input Password: " + user.getPassword());

        User existingUser = repo.findByUsername(user.getUsername());

        if (existingUser != null &&
                existingUser.getPassword().equals(user.getPassword())) {

            return "Login Success";
        } else {
            return "Invalid Credentials";
        }
    }

    @GetMapping("/user/{username}")
    public User getUser(@PathVariable String username) {
        return repo.findByUsername(username);
    }

    @PostMapping("/update")
    public String updateUser(@RequestBody User updatedUser) {

        User user = repo.findByUsername(updatedUser.getUsername());

        if (user == null) {
            return "User not found";
        }

        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());

        System.out.println("Password received: " + updatedUser.getPassword());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().trim().isEmpty()) {
            user.setPassword(updatedUser.getPassword());
        }

        repo.save(user);

        return "Profile Updated Successfully";
    }

    @PostMapping("/transfer")
    public String transferMoney(
            @RequestParam String sender,
            @RequestParam String receiver,
            @RequestParam double amount) {

        if (sender.equals(receiver)) {
            return "Cannot transfer to yourself";
        }

        User senderUser = repo.findByUsername(sender);
        User receiverUser = repo.findByUsername(receiver);

        if (senderUser == null) {
            return "Sender account not found";
        }

        if (receiverUser == null) {
            return "Receiver username does not exist";
        }

        if (amount <= 0) {
            return "Invalid amount";
        }

        if (senderUser.getBalance() < amount) {
            return "Insufficient balance";
        }

        senderUser.setBalance(senderUser.getBalance() - amount);
        receiverUser.setBalance(receiverUser.getBalance() + amount);

        repo.save(senderUser);
        repo.save(receiverUser);

        return "Transfer Successful";
    }

    @GetMapping("/balance/{username}")
    public double getBalance(@PathVariable String username) {

        User user = repo.findByUsername(username);

        if (user == null) {
            return 0;
        }

        return user.getBalance();
    }
}