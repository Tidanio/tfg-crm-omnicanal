package com.controller;

import com.service.SystemConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/configs")
public class SystemConfigController {

  @Autowired
  private SystemConfigService configService;

  // Fallback values from environment variables
  @Value("${whatsapp.api.token:}")
  private String envWhatsAppToken;

  @Value("${whatsapp.api.phone-number-id:}")
  private String envWhatsAppPhoneId;

  @GetMapping("/whatsapp")
  public ResponseEntity<Map<String, String>> getWhatsAppConfig() {
    Map<String, String> config = new HashMap<>();
    
    // Priority: DB > Env Var
    String token = configService.getValue("whatsapp_api_token", envWhatsAppToken);
    String phoneId = configService.getValue("whatsapp_phone_number_id", envWhatsAppPhoneId);

    config.put("whatsapp_api_token", token);
    config.put("whatsapp_phone_number_id", phoneId);
    
    return ResponseEntity.ok(config);
  }

  @PostMapping
  public ResponseEntity<Void> updateConfig(@RequestBody Map<String, String> payload) {
    if (payload.containsKey("whatsapp_api_token")) {
      configService.setValue("whatsapp_api_token", payload.get("whatsapp_api_token"), "WhatsApp API Access Token");
    }
    if (payload.containsKey("whatsapp_phone_number_id")) {
      configService.setValue("whatsapp_phone_number_id", payload.get("whatsapp_phone_number_id"), "WhatsApp Phone Number ID");
    }
    return ResponseEntity.ok().build();
  }
}
