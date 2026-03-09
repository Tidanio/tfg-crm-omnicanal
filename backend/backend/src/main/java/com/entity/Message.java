package com.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "messages")
public class Message {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "conversation_id")
  private Conversation conversation;

  @ManyToOne(optional = false)
  @JoinColumn(name = "inbox_id")
  private Inbox inbox;

  private String direction;

  private String senderType;

  @Column(columnDefinition = "TEXT")
  private String content;

  private String externalId;

  private String status = "sent";

  @Column(updatable = false)
  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  @Column(unique = true)
  private String emailMessageId;

  private String emailInReplyTo;

  @Column(columnDefinition = "TEXT")
  private String emailReferences;

  private String emailThreadId;

  private String emailFrom;

  private String emailTo;

  private String emailCc;

  private String emailSubject;

  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }

  public Message() {}

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Conversation getConversation() {
    return conversation;
  }

  public void setConversation(Conversation conversation) {
    this.conversation = conversation;
  }

  public Inbox getInbox() {
    return inbox;
  }

  public void setInbox(Inbox inbox) {
    this.inbox = inbox;
  }

  public String getDirection() {
    return direction;
  }

  public void setDirection(String direction) {
    this.direction = direction;
  }

  public String getSenderType() {
    return senderType;
  }

  public void setSenderType(String senderType) {
    this.senderType = senderType;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public String getExternalId() {
    return externalId;
  }

  public void setExternalId(String externalId) {
    this.externalId = externalId;
  }

  public String getStatus() {
    return status;
  }

  public void setStatus(String status) {
    this.status = status;
  }

  public void setCreatedAt(LocalDateTime createdAt) {
    this.createdAt = createdAt;
  }

  public LocalDateTime getCreatedAt() {
    return createdAt;
  }

  public LocalDateTime getUpdatedAt() {
    return updatedAt;
  }

  public String getEmailMessageId() {
    return emailMessageId;
  }

  public void setEmailMessageId(String emailMessageId) {
    this.emailMessageId = emailMessageId;
  }

  public String getEmailInReplyTo() {
    return emailInReplyTo;
  }

  public void setEmailInReplyTo(String emailInReplyTo) {
    this.emailInReplyTo = emailInReplyTo;
  }

  public String getEmailReferences() {
    return emailReferences;
  }

  public void setEmailReferences(String emailReferences) {
    this.emailReferences = emailReferences;
  }

  public String getEmailThreadId() {
    return emailThreadId;
  }

  public void setEmailThreadId(String emailThreadId) {
    this.emailThreadId = emailThreadId;
  }

  public String getEmailFrom() {
    return emailFrom;
  }

  public void setEmailFrom(String emailFrom) {
    this.emailFrom = emailFrom;
  }

  public String getEmailTo() {
    return emailTo;
  }

  public void setEmailTo(String emailTo) {
    this.emailTo = emailTo;
  }

  public String getEmailCc() {
    return emailCc;
  }

  public void setEmailCc(String emailCc) {
    this.emailCc = emailCc;
  }

  public String getEmailSubject() {
    return emailSubject;
  }

  public void setEmailSubject(String emailSubject) {
    this.emailSubject = emailSubject;
  }
}
