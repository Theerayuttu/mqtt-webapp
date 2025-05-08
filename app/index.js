import Head from "next/head";
import MQTTSub from "./components/MQTTSub";

export default function Home() {
    return (
      <div>
        <Head>
          <title>MQTT Web App</title>
        </Head>
        <main>
          <h1>Welcome MQTT Web App</h1>
          <MQTTSub />
        </main>
      </div>
    );
  }