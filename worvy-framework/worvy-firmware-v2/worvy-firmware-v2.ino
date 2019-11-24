#include "FS.h"
#include <PubSubClient.h>
#include <NTPClient.h>
#include "WiFiManager.h"
#include <WiFiUdp.h>
#include <ArduinoJson.h>
#include "HX711.h"
#include <ESP8266mDNS.h>

extern "C"
{
#include "user_interface.h"
}

char deviceid[60] = "1234-aaaaa-bbbbb";
char name[60] = "unnamed";
char accountid[60] = "1234-aaaaa-bbbbb";
char userid[60] = "1234-aaaaa-bbbbb";
char iot_endpoint[100] = "xxxxxxxx-ats.iot.ap-south-1.amazonaws.com";
char mqtt_topic[60] = "outTopic";
// StaticJsonDocument<512> configJson;
// StaticJsonDocument<256> postedJson;
String certificatePemCrt = "";
String privatePemKey = "";
String caPemCrt = "";

File fsUploadFile;
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "in.pool.ntp.org");
//Local intialization. Once its business is done, there is no need to keep it around
WiFiManager wifiManager;
//load cell initialization
// HX711 circuit wiring
const int LOADCELL_DOUT_PIN = D2;
const int LOADCELL_SCK_PIN = D3;

HX711 scale;
long loadscalereading = 0;
float count = 0;

void callback(char *topic, byte *payload, unsigned int length)
{
  Serial.print("Message arrived [");
  Serial.print(topic);
  Serial.print("] ");
  for (int i = 0; i < length; i++)
  {
    Serial.print((char)payload[i]);
  }
  Serial.println();
}

WiFiClientSecure espClient;
PubSubClient client(iot_endpoint, 8883, callback, espClient);
//set  MQTT port number to 8883 as per //standard
long lastMsg = 0;
char msg[50];
int value = 0;

void setup_wifi()
{
  delay(100);
  wifiManager.setDebugOutput(true);
  // We start by connecting to a WiFi network
  espClient.setBufferSizes(512, 512);
  Serial.print("WiFi ");

  //set callback that gets called when connecting to previous WiFi fails, and enters Access Point mode
  wifiManager.setAPCallback(configModeCallback);
  if (!wifiManager.autoConnect("WORVY-1234"))
  {
    Serial.println("failed to connect and hit timeout");
    ESP.reset();
    delay(1000);
  }
  else
  {
    Serial.println("connected:" + WiFi.SSID());
    Serial.println("IP:" + WiFi.localIP().toString());
    if (!MDNS.begin("orion"))
    { // Start the mDNS responder for esp8266.local
      MDNS.addService("http", "tcp", 80);
      Serial.println("Error setting up MDNS responder!");
    }
    Serial.println("mDNS responder started");
    // setCustomPages();
  }

  timeClient.begin();
  while (!timeClient.update())
  {
    timeClient.forceUpdate();
  }

  espClient.setX509Time(timeClient.getEpochTime());
}

void reconnect()
{

  // Loop until we're reconnected
  while (!client.connected())
  {
    Serial.print("Attempting MQTT connection...");
    // Attempt to connect
    if (client.connect(deviceid))
    {
      Serial.println("connected");
      // Once connected, publish an announcement...
      client.publish(mqtt_topic, "device connected.");
      // ... and resubscribe
      // client.subscribe(mqtt_topic);
    }
    else
    {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");

      char buf[256];
      espClient.getLastSSLError(buf, 256);
      Serial.print("WiFiClientSecure SSL error: ");
      Serial.println(buf);

      // Wait 5 seconds before retrying
      delay(5000);
    }
  }
}

//subscribe to a mqtt topic
void subscribe()
{
  client.setCallback(callback);
  client.subscribe(mqtt_topic);
  //subscript to a topic
  Serial.println("MQTT subscribed");
}

//send a message to a mqtt topic
void sendmessage()
{
  //send a message
  char buf[100];
  strcpy(buf, "{\"state\":{\"reported\":{\"on\": false}, \"desired\":{\"on\": false}}}");
  int rc = client.publish(mqtt_topic, buf);
}

void configModeCallback(WiFiManager *myWiFiManager)
{
  Serial.println("Entered config mode");
  Serial.println(WiFi.softAPIP());
  //if you used auto generated SSID, print it
  Serial.println(myWiFiManager->getConfigPortalSSID());
}

void setup()
{
  delay(5000);
  Serial.begin(115200);
  Serial.setDebugOutput(true);
  //Loading Config from flash json
  if (!loadConfig())
  {
    Serial.println("Failed to load config");
  }
  else
  {
    Serial.println("\nConfig loaded");
  }
  //setting up wifi with autoconnect
  setup_wifi();
  //start load cell scale
  scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);

  Serial.println();
  delay(1000);
  if (!SPIFFS.begin())
  {
    Serial.println("Failed to mount file system");
    return;
  }
  Serial.print("Heap: ");
  Serial.println(ESP.getFreeHeap());
  // Load certificate file
  File cert = SPIFFS.open("/cert.der", "r"); //replace cert.crt eith your uploaded file name
  if (!cert)
  {
    Serial.println("Failed to open cert file");
  }
  else
    Serial.println("Success to open cert file");

  delay(1000);

  if (espClient.loadCertificate(cert))
    Serial.println("cert loaded");
  else
    Serial.println("cert not loaded");
  cert.close();

  // Load private key file
  File private_key = SPIFFS.open("/private.der", "r"); //replace private eith your uploaded file name
  if (!private_key)
  {
    Serial.println("Failed to open private cert file");
  }
  else
    Serial.println("Success to open private cert file");

  delay(1000);

  if (espClient.loadPrivateKey(private_key))
    Serial.println("private key loaded");
  else
    Serial.println("private key not loaded");
  private_key.close();
  // Load CA file
  File ca = SPIFFS.open("/ca.der", "r"); //replace ca eith your uploaded file name
  if (!ca)
  {
    Serial.println("Failed to open ca ");
  }
  else
    Serial.println("Success to open ca");

  delay(1000);

  if (espClient.loadCACert(ca))
    Serial.println("ca loaded");
  else
    Serial.println("ca failed");
  ca.close();
  Serial.print("Heap: ");
  Serial.println(ESP.getFreeHeap());
  Serial.println("[Setup Completed.]");
}

void loop()
{
  if (!client.connected())
  {
    reconnect();
  }
  client.loop();

  long now = millis();

  if (now - lastMsg > 2000)
  {
    //load cell reading
    if (scale.is_ready())
    {
      // count = count + 1;
      //loadscalereading = ((count-1)/count) * loadscalereading + (1/count) * scale.read();
      loadscalereading = scale.read();
      loadscalereading = (loadscalereading - 88420) / 236.32;
      Serial.print("\n loadscalereading: ");
      Serial.println(loadscalereading);
    }
    else
    {
      Serial.println("HX711 not found.");
    }

    timeClient.update();

    // serializeJsonPretty(configJson, Serial);

    char output[512];
    // configJson["loadscale"] = String(loadscalereading);
    // configJson["localip"] = String(WiFi.localIP().toString());
    // configJson["wifirssi"] = String(WiFi.RSSI());
    StaticJsonDocument<256> jsondoc;
    jsondoc["deviceid"] = String(deviceid);
    jsondoc["accountid"] = String(accountid);
    jsondoc["userid"] = String(userid);
    jsondoc["wifirssi"] = String(wifiManager.getRSSIasQuality(WiFi.RSSI()));
    jsondoc["name"] = String(name);
    // jsondoc["id"] = ++value;
    jsondoc["loadscale"] = String(loadscalereading);
    jsondoc["localip"] = String(WiFi.localIP().toString());
    lastMsg = now;

    Serial.print("Publish message: ");
    serializeJson(jsondoc, output, sizeof(output));
    Serial.println(output);
    client.publish(mqtt_topic, output);
    Serial.print("Heap: ");
    Serial.println(ESP.getFreeHeap()); //Low heap can cause problems
  }
  MDNS.update();
}

// =============== Helper Functions =======================

// file io
File GetFile(String fileName)
{
  File textFile;
  if (SPIFFS.exists(fileName))
  {
    textFile = SPIFFS.open(fileName, "r");
  }
  return textFile;
}

//generate random mqtt clientID
//creating random client id
// char* clientID = generateClientID ();
char *generateClientID()
{
  char *cID = new char[23]();
  for (int i = 0; i < 23 - 1; i += 1)
    cID[i] = (char)random(1, 256);
  return cID;
}

bool loadConfig()
{
  // init values from file system
  if (SPIFFS.begin())
  {
    Serial.println("Loading Configs...\n");

    // parse json config file
    File jsonFile = GetFile("/config.json");
    if (jsonFile)
    {
      size_t size = jsonFile.size();
      if (size > 1024)
      {
        Serial.println("[Warning] Config file size is too large");
        //  return false;
      }
      // Allocate a buffer to store contents of the file.
      std::unique_ptr<char[]> buf(new char[size]);
      jsonFile.readBytes(buf.get(), size);
      StaticJsonDocument<200> doc;
      auto error = deserializeJson(doc, buf.get());
      serializeJsonPretty(doc, Serial);
      strcpy(deviceid, doc["deviceid"]);
      strcpy(iot_endpoint, doc["iot_endpoint"]);
      strcpy(mqtt_topic, doc["mqtt_topic"]);
      strcpy(accountid, doc["accountid"]);
      strcpy(userid, doc["userid"]);
      strcpy(name, doc["name"]);
      if (error)
      {
        Serial.println("Failed to parse config file");
        return false;
      }
      jsonFile.close();
    }
  }
  return true;
}

// bool saveConfig()
// {
//   // StaticJsonDocument<200> doc;
//   // doc["serverName"] = "api.example.com";
//   // doc["accessToken"] = "128du9as8du12eoue8da98h123ueh9h98";

//   File configFile = SPIFFS.open("/config.json", "w");
//   if (!configFile)
//   {
//     Serial.println("Failed to open config file for writing");
//     return false;
//   }

//   serializeJson(postedJson, configFile);
//   return true;
// }

// ============= web functions =============================

// void setCustomPages()
// {
//   server.on("/upload", HTTP_GET, handleUpload);
//   server.on("/upload", HTTP_POST, sendOkRes, handleFileUpload);
//   server.on("/config", HTTP_POST, handleSaveConfig);
//   server.onNotFound(handleNotFound);
// }

// void sendOkRes()
// {
//   server.send(200);
// }

// void handleUpload()
// {
//   if (!handleFileRead("/upload.html"))
//     server.send(404, "text/plain", "404: Not Found");
// }

// void handleNotFound()
// {
//   if (!handleFileRead(server.uri()))
//   {
//     String message = "File Not Found\n\n";
//     message += "URI: ";
//     message += server.uri();
//     message += "\nMethod: ";
//     message += server.method();
//     message += "\nArguments: ";
//     message += server.args();
//     message += "\n";

//     for (uint8_t i = 0; i < server.args(); i++)
//     {
//       message += " " + server.argName(i) + ": " + server.arg(i) + "\n";
//     }
//     server.sendHeader("Cache-Control", "no-cache, no-store, must-revalidate");
//     server.sendHeader("Pragma", "no-cache");
//     server.sendHeader("Expires", "-1");
//     server.sendHeader("Content-Length", String(message.length()));
//     server.send(404, "text/plain", message);
//   }
// }

// void handleSaveConfig()
// {
//   char output[256];
//   String message = "Config Body received:\n";
//   message += server.arg("plain");
//   Serial.println(message);
//   // StaticJsonDocument<256> doc;
//   deserializeJson(postedJson, server.arg("plain"));

//   if (!saveConfig())
//   {
//     server.send(500, "text/plain", "save config failure.");
//   }
//   server.send(202, "text/plain", "config saved.");
// }

// String getContentType(String filename)
// { // convert the file extension to the MIME type
//   if (filename.endsWith(".html"))
//     return "text/html";
//   else if (filename.endsWith(".css"))
//     return "text/css";
//   else if (filename.endsWith(".htm"))
//     return "text/html";
//   else if (filename.endsWith(".js"))
//     return "application/javascript";
//   else if (filename.endsWith(".ico"))
//     return "image/x-icon";
//   else if (filename.endsWith(".gz"))
//     return "application/x-gzip";
//   return "text/plain";
// }

// bool handleFileRead(String path)
// {
//   Serial.println("handleFileRead: " + path);
//   if (path.endsWith("/"))
//     path += "index.html";                    // If a folder is requested, send the index file
//   String contentType = getContentType(path); // Get the MIME type
//   String pathWithGz = path + ".gz";
//   if (SPIFFS.exists(pathWithGz) || SPIFFS.exists(path))
//   {                                                     // If the file exists, either as a compressed archive, or normal
//     if (SPIFFS.exists(pathWithGz))                      // If there's a compressed version available
//       path += ".gz";                                    // Use the compressed verion
//     File file = SPIFFS.open(path, "r");                 // Open the file
//     size_t sent = server.streamFile(file, contentType); // Send it to the client
//     file.close();                                       // Close the file again
//     Serial.println(String("\tSent file: ") + path);
//     return true;
//   }
//   Serial.println(String("\tFile Not Found: ") + path); // If the file doesn't exist, return false
//   return false;
// }

// void handleFileUpload()
// { // upload a new file to the SPIFFS

//   HTTPUpload &upload = server.upload();
//   if (upload.status == UPLOAD_FILE_START)
//   {
//     String filename = upload.filename;
//     if (!filename.startsWith("/"))
//       filename = "/" + filename;
//     Serial.print("handleFileUpload Name: ");
//     Serial.println(filename);
//     fsUploadFile = SPIFFS.open(filename, "w"); // Open the file for writing in SPIFFS (create if it doesn't exist)
//     filename = String();
//   }
//   else if (upload.status == UPLOAD_FILE_WRITE)
//   {
//     if (fsUploadFile)
//       fsUploadFile.write(upload.buf, upload.currentSize); // Write the received bytes to the file
//   }
//   else if (upload.status == UPLOAD_FILE_END)
//   {
//     if (fsUploadFile)
//     {                       // If the file was successfully created
//       fsUploadFile.close(); // Close the file again
//       Serial.print("handleFileUpload Size: ");
//       Serial.println(upload.totalSize);
//       server.sendHeader("Location", "/upload"); // Redirect the client to the success page
//       server.send(303);
//     }
//     else
//     {
//       server.send(500, "text/plain", "500: couldn't create file");
//     }
//   }
// }

// Get an architecture of compiled
String getArch()
{
#if defined(ARDUINO_ARCH_ESP8266)
  return "ESP8266";
#elif defined(ARDUINO_ARCH_ESP32)
  return "ESP32";
#endif
}
