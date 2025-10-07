package com.farmchainx.api.farmer.controllers;

import com.farmchainx.api.auth.entities.RoleName;
import com.farmchainx.api.auth.repo.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public")
public class PublicDirectoryController {

    private final UserRepository users;

    public PublicDirectoryController(UserRepository users) {
        this.users = users;
    }

    // Minimal DTO for directory listings
    static record UserSummary(Long id, String name, String email, String mobile) {}

    @GetMapping("/distributors")
    public ResponseEntity<List<UserSummary>> distributors() {
        var list = users.findAllByRoles_Name(RoleName.DISTRIBUTOR);
        var dto  = list.stream()
                .map(u -> new UserSummary(u.getId(), u.getFullName(), u.getEmail(), u.getMobile()))
                .toList();
        return ResponseEntity.ok(dto);
    }

    @GetMapping("/retailers")
    public ResponseEntity<List<UserSummary>> retailers() {
        var list = users.findAllByRoles_Name(RoleName.RETAILER);
        var dto  = list.stream()
                .map(u -> new UserSummary(u.getId(), u.getFullName(), u.getEmail(), u.getMobile()))
                .toList();
        return ResponseEntity.ok(dto);
    }
}
