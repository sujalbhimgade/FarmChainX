package com.farmchainx.api.trace.controllers;

import com.farmchainx.api.trace.entities.TraceEvent;
import com.farmchainx.api.trace.services.TraceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trace")
public class TraceController {
  private final TraceService service;
  public TraceController(TraceService service) {
    this.service = service;
  }
  
  @GetMapping("/{batchCode}")
  public ResponseEntity<List<TraceEvent>> journey(@PathVariable String batchCode) {
    return ResponseEntity.ok(service.journey(batchCode));
  }
}
