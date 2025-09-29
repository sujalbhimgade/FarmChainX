// src/main/java/com/farmchainx/api/farmer/controllers/CropController.java
package com.farmchainx.api.farmer.controllers;

import com.farmchainx.api.farmer.dto.CropDto;
import com.farmchainx.api.farmer.entities.Crop;
import com.farmchainx.api.farmer.services.CropService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/crops")
public class CropController {

  private final CropService service;

  public CropController(CropService service) {
    this.service = service;
  }

  @PostMapping
  public ResponseEntity<Map<String, Object>> create(@RequestBody @Valid CropDto dto) {
    Crop saved = service.create(dto);
    Map<String, Object> resp = new LinkedHashMap<>();
    resp.put("id", saved.getId());
    resp.put("name", saved.getName());
    resp.put("batchCode", saved.getBatchCode());
    resp.put("publicId", saved.getPublicId());
    resp.put("publicVisible", saved.isPublicVisible());
    resp.put("publicUrl", "/showcase/" + saved.getPublicId());
    return ResponseEntity.ok(resp);
  }

  @GetMapping
  public ResponseEntity<List<Crop>> myCrops() {
    return ResponseEntity.ok(service.myCrops());
  }

  @GetMapping("/{id}")
  public ResponseEntity<Crop> byId(@PathVariable Long id) {
    return ResponseEntity.ok(service.one(id));
  }

  @PatchMapping("/{id}")
  @PreAuthorize("@cropService.canEdit(#id)")
  public ResponseEntity<Crop> update(@PathVariable Long id, @RequestBody CropDto dto) {
    return ResponseEntity.ok(service.updatePartial(id, dto));
  }

  @DeleteMapping("/{id}")
  @PreAuthorize("@cropService.canEdit(#id)")
  public ResponseEntity<Void> delete(@PathVariable Long id) {
    service.deleteById(id);
    return ResponseEntity.noContent().build();
  }
}
