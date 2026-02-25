package com.dto;

import java.util.List;

public class EmailWebhookDTO {
  private String messageId;
  private String inReplyTo;
  private List<String> references;
  private String from;
  private List<String> to;
  private List<String> cc;
  private String subject;
  private String text;

  public EmailWebhookDTO() {}

  public String getMessageId() {
    return messageId;
  }

  public void setMessageId(String messageId) {
    this.messageId = messageId;
  }

  public String getInReplyTo() {
    return inReplyTo;
  }

  public void setInReplyTo(String inReplyTo) {
    this.inReplyTo = inReplyTo;
  }

  public List<String> getReferences() {
    return references;
  }

  public void setReferences(List<String> references) {
    this.references = references;
  }

  public String getFrom() {
    return from;
  }

  public void setFrom(String from) {
    this.from = from;
  }

  public List<String> getTo() {
    return to;
  }

  public void setTo(List<String> to) {
    this.to = to;
  }

  public List<String> getCc() {
    return cc;
  }

  public void setCc(List<String> cc) {
    this.cc = cc;
  }

  public String getSubject() {
    return subject;
  }

  public void setSubject(String subject) {
    this.subject = subject;
  }

  public String getText() {
    return text;
  }

  public void setText(String text) {
    this.text = text;
  }
}
