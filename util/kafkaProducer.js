// kafkaUtil.js
const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "health-tracker-service",
  brokers: ["localhost:9092"],
});



const publishAppEvent = async (eventType, message) => {
  try {
    console.log("🚀 Initializing Kafka producer...");
    const producer = kafka.producer();
    await producer.connect();
    console.log("✅ Kafka producer connected");

    const eventPayload = {
      eventType,
      message,
      timestamp: new Date().toISOString(),
    };

    console.log(`📤 Preparing to send event to topic [app-events]:`, eventPayload);

    await producer.send({
      topic: "app-events",
      messages: [{ value: JSON.stringify(eventPayload) }],
    });

    console.log(`🎯 Successfully published [${eventType}] event to app-events`);

  } catch (error) {
    console.error("❌ Failed to publish event to Kafka:", error.message);
  } finally {
    try {
      await producer.disconnect();
      console.log("👋 Kafka producer disconnected cleanly");
    } catch (err) {
      console.error("⚠️ Error disconnecting Kafka producer:", err.message);
    }
  }
};

module.exports = { publishAppEvent };
