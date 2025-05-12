package com.zayimhan.ecommerce.service;

import com.zayimhan.ecommerce.dao.RoleRepository;
import com.zayimhan.ecommerce.dao.UserRepository;
import com.zayimhan.ecommerce.entity.Role;
import com.zayimhan.ecommerce.entity.User;
import com.zayimhan.ecommerce.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final RoleRepository roleRepo;
    private final PasswordEncoder encoder;
    private final AuthenticationManager authManager;
    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public AuthService(UserRepository userRepo,
                       RoleRepository roleRepo,
                       PasswordEncoder encoder,
                       AuthenticationManager authManager,
                       JwtUtil jwtUtil,
                       CustomUserDetailsService userDetailsService) {
        this.userRepo = userRepo;
        this.roleRepo = roleRepo;
        this.encoder = encoder;
        this.authManager = authManager;
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    public String register(String email, String password) {
        if (userRepo.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("Bu e-posta zaten kayıtlı.");
        }

        Role defaultRole = roleRepo.findByName("ROLE_CUSTOMER")
                .orElseThrow(() -> new RuntimeException("Varsayılan rol bulunamadı: ROLE_CUSTOMER"));

        User user = new User();
        user.setEmail(email);
        user.setPassword(encoder.encode(password));
        user.setRoles(Collections.singleton(defaultRole));
        user.setEnabled(true);

        userRepo.save(user);

        // ✅ Rollerle birlikte token oluştur
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);
        return jwtUtil.generateToken(userDetails);
    }

    public String login(String email, String password) {
        // Kullanıcıyı veritabanından bul
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new BadCredentialsException("Geçersiz e-posta veya şifre."));

        // Hesap aktif değilse girişe izin verme
        if (!user.isEnabled()) {
            throw new DisabledException("Kullanıcı hesabı devre dışı.");
        }

        try {
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(email, password)
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            return jwtUtil.generateToken(userDetails);

        } catch (AuthenticationException ex) {
            throw new BadCredentialsException("Geçersiz e-posta veya şifre.");
        }
    }




}
