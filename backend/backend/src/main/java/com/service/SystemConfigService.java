package com.service;

import com.entity.SystemConfig;
import com.repository.SystemConfigRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SystemConfigService {

  @Autowired
  private SystemConfigRepository repository;

  public String getValue(String key) {
    return repository.findByKey(key)
        .map(SystemConfig::getValue)
        .orElse(null);
  }

  public String getValue(String key, String defaultValue) {
    return repository.findByKey(key)
        .map(SystemConfig::getValue)
        .orElse(defaultValue);
  }

  public void setValue(String key, String value, String description) {
    Optional<SystemConfig> existing = repository.findByKey(key);
    SystemConfig config;
    if (existing.isPresent()) {
      config = existing.get();
      config.setValue(value);
      if (description != null) {
        config.setDescription(description);
      }
    } else {
      config = SystemConfig.builder()
          .key(key)
          .value(value)
          .description(description)
          .build();
    }
    repository.save(config);
  }
}
