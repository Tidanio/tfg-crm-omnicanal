package com.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "contacts")
public class Contact {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;
  private String name;
  @Column(unique = true)
  private String email;
  @Column(unique = true)
  private String whatsappId;
  @Column(unique = true)
  private String instagramId;

  public Contact() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }
  public String getName() { return name; }
  public void setName(String name) { this.name = name; }
  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }
  public String getWhatsappId() { return whatsappId; }
  public void setWhatsappId(String whatsappId) { this.whatsappId = whatsappId; }
  public String getInstagramId() { return instagramId; }
  public void setInstagramId(String instagramId) { this.instagramId = instagramId; }
}
