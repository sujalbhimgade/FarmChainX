// src/main/java/com/farmchainx/api/farmer/controllers/PublicCropController.java
package com.farmchainx.api.farmer.controllers;

import com.farmchainx.api.farmer.entities.Crop;
import com.farmchainx.api.farmer.repo.CropRepository;
import com.farmchainx.api.trace.entities.SupplyStage;
import com.farmchainx.api.trace.entities.TraceEvent;
import com.farmchainx.api.trace.repo.TraceEventRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/public/crops")
public class PublicCropController {

  private final CropRepository crops;
  private final TraceEventRepository trace;

  public PublicCropController(CropRepository crops, TraceEventRepository trace) {
    this.crops = crops;
    this.trace = trace;
  }

  @GetMapping("/{publicId}")
  public ResponseEntity<Map<String, Object>> getPublic(@PathVariable String publicId) {
    Crop c = crops.findByPublicId(publicId).orElse(null);
    if (c == null || !Boolean.TRUE.equals(c.isPublicVisible())) {
      return ResponseEntity.notFound().build();
    }

    String batchCode = c.getBatchCode();

    // Load events with null-safe fallbacks
    List<TraceEvent> events = (batchCode == null)
        ? List.of()
        : trace.findByBatchCodeOrderByCreatedAtAsc(batchCode);

    Optional<TraceEvent> latest = (batchCode == null)
        ? Optional.empty()
        : trace.findTopByBatchCodeOrderByCreatedAtDesc(batchCode);

    String currentStage = latest.map(TraceEvent::getStage)
                                .map(Enum::name)
                                .orElse("FARMER");
    String currentHolder = latest.map(TraceEvent::getLocation)
                                 .orElse(c.getFieldLocation());

    // Build journey with LinkedHashMap to allow nulls safely
    List<Map<String, Object>> journey = new ArrayList<>();
    for (TraceEvent e : events) {
      Map<String, Object> step = new LinkedHashMap<>();
      step.put("stage", e.getStage() == null ? null : e.getStage().name());
      step.put("location", e.getLocation());                     // may be null
      step.put("at", e.getCreatedAt());                          // may be null
      journey.add(step);
    }

    boolean farmer = "FARMER".equals(currentStage) || events.stream().anyMatch(x -> x.getStage() == SupplyStage.FARMER);
    boolean distributor = "DISTRIBUTOR".equals(currentStage) || events.stream().anyMatch(x -> x.getStage() == SupplyStage.DISTRIBUTOR);
    boolean retailer = "RETAILER".equals(currentStage) || events.stream().anyMatch(x -> x.getStage() == SupplyStage.RETAILER);
    boolean consumer = "CONSUMER".equals(currentStage) || events.stream().anyMatch(x -> x.getStage() == SupplyStage.CONSUMER);

    Map<String, Object> progress = new LinkedHashMap<>();
    progress.put("farmer", farmer);
    progress.put("distributor", distributor);
    progress.put("retailer", retailer);
    progress.put("consumer", consumer);

    // Null-safe DTO
    Map<String, Object> dto = new LinkedHashMap<>();
    dto.put("publicId", c.getPublicId());
    dto.put("title", c.getName());
    dto.put("image_url", c.getImage_url());                       // use camelCase getter
    dto.put("type", c.getType());
    dto.put("farmName", c.getFarmer() != null ? c.getFarmer().getFullName() : null);
    dto.put("batchCode", batchCode);
    dto.put("plantedDate", c.getPlantedDate());                 // let Jackson serialize
    dto.put("pestControl", c.getPesticides());
    dto.put("contactAddress", c.getFieldLocation());
    dto.put("contactPhone", c.getFarmer() != null ? c.getFarmer().getMobile() : null);
    dto.put("contactEmail", c.getFarmer() != null ? c.getFarmer().getEmail() : null);
    dto.put("currentStage", currentStage);
    dto.put("currentHolder", currentHolder);
    dto.put("progress", progress);
    dto.put("journey", journey);

    return ResponseEntity.ok(dto);
  }

}