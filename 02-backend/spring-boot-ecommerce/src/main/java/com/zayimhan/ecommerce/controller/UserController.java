package com.zayimhan.ecommerce.controller;

import com.zayimhan.ecommerce.dao.RoleRepository;
import com.zayimhan.ecommerce.dao.UserRepository;
import com.zayimhan.ecommerce.entity.Role;
import com.zayimhan.ecommerce.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

@RestController
@RequestMapping("/api/users")
@CrossOrigin("http://localhost:4200")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Bu e-posta zaten kayıtlı.");
        }

        String incomingRoleName = user.getRoles().stream()
                .findFirst()
                .map(Role::getName)
                .orElse("ROLE_CUSTOMER");

        Role role = roleRepository.findByName(incomingRoleName)
                .orElseThrow(() -> new RuntimeException("Rol bulunamadı: " + incomingRoleName));

        user.setRoles(Collections.singleton(role));
        user.setEnabled(true);

        // ✨ Şifreyi encode et
        user.setPassword(passwordEncoder.encode(user.getPassword()));

        userRepository.save(user);

        return ResponseEntity.ok("Kullanıcı başarıyla kaydedildi.");
    }

    @PostMapping("/register-admin")
    public ResponseEntity<?> registerAdmin(@RequestBody User user) {
        Optional<Role> adminRole = roleRepository.findByName("ROLE_ADMIN");
        if (adminRole.isEmpty()) {
            return ResponseEntity.badRequest().body("ROLE_ADMIN bulunamadı.");
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Set.of(adminRole.get()));
        user.setEnabled(true);
        userRepository.save(user);

        return ResponseEntity.ok("Admin kullanıcı oluşturuldu.");
    }
}
