// src/main/java/com/farmchainx/api/farmer/services/CropService.java
package com.farmchainx.api.farmer.services;

import com.farmchainx.api.auth.entities.User;
import com.farmchainx.api.auth.repo.UserRepository;
import com.farmchainx.api.farmer.dto.CropDto;
import com.farmchainx.api.farmer.dto.CropResponse;
import com.farmchainx.api.farmer.entities.Crop;
import com.farmchainx.api.farmer.repo.CropRepository;
import com.farmchainx.api.security.SecurityUtils;
import com.farmchainx.api.trace.entities.SupplyStage;
import com.farmchainx.api.trace.services.TraceService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service("cropService")
public class CropService {

  private final CropRepository crops;
  private final UserRepository users;
  private final TraceService trace;

  public CropService(CropRepository crops, UserRepository users, TraceService trace) {
    this.crops = crops;
    this.users = users;
    this.trace = trace;
  }

  // Authorization hook for @PreAuthorize("@cropService.canEdit(#id)")
  @Transactional(readOnly = true)
  public boolean canEdit(Long id) {
    var me = SecurityUtils.currentUser(users).orElse(null);
    var crop = crops.findById(id).orElse(null);
    return me != null && crop != null && crop.getFarmer().getId().equals(me.getId());
  }

  @Transactional
  public Crop create(CropDto dto) {
    User farmer = SecurityUtils.currentUser(users).orElseThrow();
    String batch = generateBatch();

    Crop c = Crop.builder()
        .farmer(farmer)
        .name(dto.name())
        .type(dto.type())
        .soil_type(dto.soil_type())
        .fieldLocation(dto.fieldLocation())
        .area(dto.area())
        .area_unit(dto.area_unit())
        .gpsCoordinates(dto.gpsCoordinates())
        .image_url(dto.image_url())
        .pesticides(dto.pesticides())
        .plantedDate(dto.plantedDate())
        .harvestDate(dto.harvestDate())
        .status(dto.status())
        .quantityKg(dto.quantityKg())
        .unitPrice(dto.unitPrice())
        .qualityGrade(dto.qualityGrade())
        .notes(dto.notes())
        .batchCode(batch)
        .created_at(Instant.now())
        .updated_at(Instant.now())
        .build();

    // Auto-publish on create
    c.setPublicId(UUID.randomUUID().toString().replace("-", ""));
    c.setPublicVisible(true);
    c.setPublishedAt(Instant.now());

    Crop saved = crops.save(c);

    // Log initial journey event
    trace.add(saved.getBatchCode(), SupplyStage.FARMER, saved.getFieldLocation(), "Crop created", farmer);

    return saved;
  }

  // PATCH-style partial update: only non-null DTO fields are applied
  @Transactional
  public Crop updatePartial(Long id, CropDto dto) {
    Crop crop = crops.findById(id).orElseThrow();
    if (dto.name() != null) crop.setName(dto.name());
    if (dto.type() != null) crop.setType(dto.type());
    if (dto.soil_type() != null) crop.setSoil_type(dto.soil_type());
    if (dto.fieldLocation() != null) crop.setFieldLocation(dto.fieldLocation());
    if (dto.area() != null) crop.setArea(dto.area());
    if (dto.area_unit() != null) crop.setArea_unit(dto.area_unit());
    if (dto.gpsCoordinates() != null) crop.setGpsCoordinates(dto.gpsCoordinates());
    if (dto.image_url() != null) crop.setImage_url(dto.image_url());
    if (dto.pesticides() != null) crop.setPesticides(dto.pesticides());
    if (dto.plantedDate() != null) crop.setPlantedDate(dto.plantedDate());
    if (dto.harvestDate() != null) crop.setHarvestDate(dto.harvestDate());
    if (dto.status() != null) crop.setStatus(dto.status());
    if (dto.quantityKg() != null) crop.setQuantityKg(dto.quantityKg());
    if (dto.unitPrice() != null) crop.setUnitPrice(dto.unitPrice());
    if (dto.qualityGrade() != null) crop.setQualityGrade(dto.qualityGrade());
    if (dto.notes() != null) crop.setNotes(dto.notes());
    return crops.save(crop);
  }

  @Transactional
  public void deleteById(Long id) {
    crops.deleteById(id);
  }

  @Transactional(readOnly = true)
  public List<Crop> myCrops() {
    User farmer = SecurityUtils.currentUser(users).orElseThrow();
    return crops.findByFarmer(farmer);
  }

  @Transactional(readOnly = true)
  public Crop one(Long id) {
    return crops.findById(id).orElseThrow();
  }

  // Mapper kept local for simplicity
  @Transactional(readOnly = true)
  public CropResponse toResponse(Crop c) {
    return new CropResponse(
        c.getId(),
        c.getName(),
        c.getType(),
        c.getSoil_type(),
        c.getFieldLocation(),
        c.getArea(),
        c.getArea_unit(),
        c.getGpsCoordinates(),
        c.getImage_url(),
        c.getPesticides(),
        c.getPlantedDate(),
        c.getHarvestDate(),
        c.getStatus(),
        c.getQuantityKg(),
        c.getUnitPrice(),
        c.getQualityGrade(),
        c.getNotes(),
        c.getBatchCode(),
        c.getCreated_at(),
        c.getUpdated_at()
        
    );
  }

  private String generateBatch() {
    String base = "BATCH-" + System.currentTimeMillis();
    return base + "-" + new Random().nextInt(999);
  }
}
