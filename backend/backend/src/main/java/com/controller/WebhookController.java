package com.controller;

import com.service.InboundService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.security.MessageDigest;

@RestController
@RequestMapping("/webhooks/meta")
public class WebhookController {

  private static final Logger logger = LoggerFactory.getLogger(WebhookController.class);

  private final InboundService inboundService;
  private final String verifyToken;
  private final String appSecret;

  public WebhookController(InboundService inboundService,
                           @Value("${meta.verify.token}") String verifyToken,
                           @Value("${meta.app.secret}") String appSecret) {
    this.inboundService = inboundService;
    this.verifyToken = verifyToken;
    this.appSecret = appSecret;
  }

  @GetMapping("/{channel}")
  public ResponseEntity<String> verify(
      @PathVariable String channel,
      @RequestParam(name = "hub.mode", required = false) String mode,
      @RequestParam(name = "hub.verify_token", required = false) String token,
      @RequestParam(name = "hub.challenge", required = false) String challenge
  ) {
    logger.info("Verify request: mode={}, token={}, challenge={}", mode, token, challenge);
    if ("subscribe".equals(mode) && verifyToken != null && verifyToken.equals(token)) {
      logger.info("Verify success");
      return ResponseEntity.ok(challenge);
    }
    logger.warn("Verify failed: expected token={}", verifyToken);
    return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Invalid token");
  }

  @PostMapping("/{channel}")
  public ResponseEntity<Void> receive(
      @PathVariable String channel,
      @RequestHeader(value = "X-Hub-Signature-256", required = false) String sig256,
      @RequestHeader(value = "X-Hub-Signature", required = false) String sig1,
      @RequestBody String payload
  ) {
    logger.info("Payload received [{}]: {}", channel, payload);
    if (!verifySignature(payload, sig256, sig1, appSecret)) {
      logger.warn("Signature verification failed");
      return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
    }
    inboundService.process(channel, payload);
    return ResponseEntity.ok().build();
  }

  private boolean verifySignature(String body, String sig256, String sig1, String secret) {
    try {
      if (sig256 != null && sig256.startsWith("sha256=")) {
        String expected = "sha256=" + hmac("HmacSHA256", secret, body);
        return MessageDigest.isEqual(expected.getBytes(), sig256.getBytes());
      }
      if (sig1 != null && sig1.startsWith("sha1=")) {
        String expected = "sha1=" + hmac("HmacSHA1", secret, body);
        return MessageDigest.isEqual(expected.getBytes(), sig1.getBytes());
      }
    } catch (Exception ignored) {}
    return false;
  }

  private String hmac(String algo, String secret, String data) throws Exception {
    Mac mac = Mac.getInstance(algo);
    mac.init(new SecretKeySpec(secret.getBytes(), algo));
    byte[] raw = mac.doFinal(data.getBytes());
    StringBuilder sb = new StringBuilder();
    for (byte b : raw) sb.append(String.format("%02x", b));
    return sb.toString();
  }
}
