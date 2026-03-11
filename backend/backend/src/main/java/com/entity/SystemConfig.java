package com.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "system_configs")
public class SystemConfig {

  @Id
  @Column(name = "config_key", nullable = false, unique = true)
  private String key;

  @Column(name = "config_value", columnDefinition = "TEXT")
  private String value;

  @Column(name = "description")
  private String description;

  public SystemConfig() {}

  public SystemConfig(String key, String value, String description) {
    this.key = key;
    this.value = value;
    this.description = description;
  }

  public String getKey() { return key; }
  public void setKey(String key) { this.key = key; }

  public String getValue() { return value; }
  public void setValue(String value) { this.value = value; }

  public String getDescription() { return description; }
  public void setDescription(String description) { this.description = description; }

  public static SystemConfigBuilder builder() {
    return new SystemConfigBuilder();
  }

  public static class SystemConfigBuilder {
    private String key;
    private String value;
    private String description;

    public SystemConfigBuilder key(String key) { this.key = key; return this; }
    public SystemConfigBuilder value(String value) { this.value = value; return this; }
    public SystemConfigBuilder description(String description) { this.description = description; return this; }

    public SystemConfig build() {
      return new SystemConfig(key, value, description);
    }
  }
}
