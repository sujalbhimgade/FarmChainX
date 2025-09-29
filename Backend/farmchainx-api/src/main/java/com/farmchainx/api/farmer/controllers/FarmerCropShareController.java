package com.farmchainx.api.farmer.controllers;

import com.farmchainx.api.farmer.entities.Crop;
import com.farmchainx.api.farmer.repo.CropRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/farmer/crops")
@PreAuthorize("hasRole('FARMER') or hasRole('ADMIN')")
public class FarmerCropShareController {

  private final CropRepository crops;

  public FarmerCropShareController(CropRepository crops) {
    this.crops = crops;
  }

  @PostMapping("/{id}/publish")
  public ResponseEntity<Map<String, Object>> publish(@PathVariable Long id) {
    Crop crop = crops.findById(id).orElseThrow();
    if (crop.getPublicId() == null || crop.getPublicId().isBlank()) {
      // short, non-guessable token; store without hyphens
      crop.setPublicId(UUID.randomUUID().toString().replace("-", ""));
    }
    crop.setPublicVisible(true);
    crop.setPublishedAt(Instant.now());
    crops.save(crop);

    String publicUrl = "/showcase/" + crop.getPublicId();
    return ResponseEntity.ok(Map.of(
        "id", crop.getId(),
        "publicId", crop.getPublicId(),
        "publicVisible", crop.isPublicVisible(),
        "publishedAt", crop.getPublishedAt(),
        "publicUrl", publicUrl
    ));
  }

  @DeleteMapping("/{id}/publish")
  public ResponseEntity<Void> unpublish(@PathVariable Long id) {
    Crop crop = crops.findById(id).orElseThrow();
    crop.setPublicVisible(false);
    crops.save(crop);
    return ResponseEntity.noContent().build();
  }
}
