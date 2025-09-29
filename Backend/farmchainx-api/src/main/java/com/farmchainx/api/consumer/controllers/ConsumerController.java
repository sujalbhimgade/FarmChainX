package com.farmchainx.api.consumer.controllers;

import com.farmchainx.api.farmer.entities.Crop;
import com.farmchainx.api.farmer.repo.CropRepository;
import com.farmchainx.api.trace.entities.TraceEvent;
import com.farmchainx.api.trace.services.TraceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/consumer")
public class ConsumerController {
  private final CropRepository crops;
  private final TraceService trace;

  public ConsumerController(CropRepository crops, TraceService trace) {
    this.crops = crops;
    this.trace = trace;
  }

  @GetMapping("/product/{batchCode}")
  public ResponseEntity<Map<String, Object>> product(@PathVariable String batchCode) {
    Crop crop = crops.findByBatchCode(batchCode).orElseThrow();
    List<TraceEvent> journey = trace.journey(batchCode);
    return ResponseEntity.ok(Map.of(
        "name", crop.getName(),
        "type", crop.getType(),
        "batchCode", crop.getBatchCode(),
        "quantityKg", crop.getQuantityKg(),
        "qualityGrade", crop.getQualityGrade(),
        "journey", journey
    ));
  }
}
